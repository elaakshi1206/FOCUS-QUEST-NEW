import { Request, Response } from "express";
import { db } from "@workspace/db";
import { challenges, challengeQuestions, teams } from "@workspace/db/schema";
import { eq, or, and } from "drizzle-orm";
import { getIO } from "../lib/socket";
import { logger } from "../lib/logger";
import { getFallbackQuestions } from "../lib/questions";

// Create or matchmake a new challenge
export const createChallenge = async (req: Request, res: Response) => {
  try {
    const { teamId, challengeType, world } = req.body;

    let teamIdToUse = Number(teamId);
    let [team] = await db.select().from(teams).where(eq(teams.id, teamIdToUse));
    const requestedTheme = world === "Ocean Pirate Adventure" ? "ocean" : world === "Space Explorer" ? "space" : "future";

    // For demo purposes: if team not found or wrong theme, auto-assign the first team matching the world
    if (!team || team.theme !== requestedTheme) {
      const [fallbackTeam] = await db.select().from(teams).where(eq(teams.theme, requestedTheme)).limit(1);
      if (fallbackTeam) {
        team = fallbackTeam;
        teamIdToUse = fallbackTeam.id;
      } else {
        const [newTeam] = await db.insert(teams).values({
          teamId: `demo-team-${Date.now()}`,
          name: `Demo Team ${world}`,
          theme: requestedTheme,
        }).returning();
        team = newTeam;
        teamIdToUse = newTeam.id;
      }
    }

    // Attempt matchmaking: Find existing pending challenge in same world
    const [pendingChallenge] = await db
      .select()
      .from(challenges)
      .where(
        and(
          eq(challenges.world, world),
          eq(challenges.status, "pending"),
          eq(challenges.challengeType, challengeType)
        )
      )
      .limit(1);

    if (pendingChallenge && pendingChallenge.team1Id !== teamIdToUse) {
      // Join existing challenge
      const [updatedChallenge] = await db.update(challenges)
        .set({ team2Id: teamIdToUse, status: "active", startedAt: new Date() })
        .where(eq(challenges.id, pendingChallenge.id))
        .returning();

      // Notify clients
      const io = getIO();
      io.to(`challenge_${updatedChallenge.id}`).emit("challengeStarted", updatedChallenge);

      return res.json({ message: "Matched with another team!", challenge: updatedChallenge });
    }

    // Create new pending challenge
    const [newChallenge] = await db.insert(challenges).values({
      challengeType,
      world,
      status: "pending",
      team1Id: teamIdToUse,
      settings: { questionsCount: 5 }
    }).returning();

    // Generate questions dynamically (Mocking AI interaction for now or calling AI service)
    await generateQuestionsForChallenge(newChallenge.id, world, challengeType);

    return Object.assign(res.json({ message: "Challenge created, waiting for opponent...", challenge: newChallenge }));
  } catch (error) {
    logger.error({ err: error }, "Error creating challenge");
    return Object.assign(res.status(500).json({ error: "Internal server error" }));
  }
};

export const getAvailableChallenges = async (req: Request, res: Response) => {
  try {
    const { world } = req.query;
    if (!world) {
      return res.status(400).json({ error: "World parameter is required" });
    }
    
    const available = await db.select()
      .from(challenges)
      .where(and(eq(challenges.world, String(world)), eq(challenges.status, "pending")));

    return Object.assign(res.json(available));
  } catch (error) {
    return Object.assign(res.status(500).json({ error: "Internal server error" }));
  }
};

export const joinChallenge = async (req: Request, res: Response) => {
  // Logic to manually join a challenge by ID
  try {
    const { challengeId } = req.params;
    const { teamId } = req.body;

    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, Number(challengeId)));
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    if (challenge.status !== "pending") return res.status(400).json({ error: "Challenge is not pending" });

    let teamIdToUse = Number(teamId);
    let [team] = await db.select().from(teams).where(eq(teams.id, teamIdToUse));
    const requestedTheme = challenge.world === "Ocean Pirate Adventure" ? "ocean" : challenge.world === "Space Explorer" ? "space" : "future";

    // For demo purposes: if team not found or wrong theme, auto-assign the first team matching the world
    if (!team || team.theme !== requestedTheme) {
      const [fallbackTeam] = await db.select().from(teams).where(eq(teams.theme, requestedTheme)).limit(1);
      if (fallbackTeam) {
        team = fallbackTeam;
        teamIdToUse = fallbackTeam.id;
      } else {
        const [newTeam] = await db.insert(teams).values({
          teamId: `demo-team-${Date.now()}`,
          name: `Demo Team ${challenge.world}`,
          theme: requestedTheme,
        }).returning();
        team = newTeam;
        teamIdToUse = newTeam.id;
      }
    }

    const [updated] = await db.update(challenges)
      .set({ team2Id: teamIdToUse, status: "active", startedAt: new Date() })
      .where(eq(challenges.id, challenge.id))
      .returning();

    const io = getIO();
    io.to(`challenge_${challenge.id}`).emit("challengeStarted", updated);

    return Object.assign(res.json(updated));
  } catch (error) {
    return Object.assign(res.status(500).json({ error: "Internal server error" }));
  }
};

export const getChallengeStatus = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, Number(challengeId)));
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    let questions = await db.select().from(challengeQuestions).where(eq(challengeQuestions.challengeId, Number(challengeId)));

    // Auto-repair legacy mock questions
    if (questions.length > 0 && typeof questions[0].questionText === 'string' && questions[0].questionText.includes("] What is the answer to this")) {
      await db.delete(challengeQuestions).where(eq(challengeQuestions.challengeId, Number(challengeId)));
      await generateMockQuestions(Number(challengeId), challenge.world, challenge.challengeType);
      questions = await db.select().from(challengeQuestions).where(eq(challengeQuestions.challengeId, Number(challengeId)));
    }

    return Object.assign(res.json({ challenge, questions }));
  } catch (error) {
    return Object.assign(res.status(500).json({ error: "Internal server error" }));
  }
};


import { GoogleGenerativeAI } from "@google/generative-ai";

async function generateQuestionsForChallenge(challengeId: number, world: string, challengeType: string) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY_1;
  if (!apiKey) {
    logger.warn("GEMINI_API_KEY not found. Falling back to mock questions.");
    return generateMockQuestions(challengeId, world, challengeType);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let systemPrompt = "";
  if (world === "Ocean Pirate Adventure") {
    systemPrompt = "You are preparing a quiz for Grades 1-4. Theme: Pirate ships, ocean creatures, treasure hunts. Use pirate emojis like 🏴‍☠️🦜⚓. Focus on Basic Math (simple addition, subtraction), EVS (basic environment, ocean), and Basic English (simple grammar, vocabulary). Use simple language, easy examples, and avoid complex logic.";
  } else if (world === "Space Explorer") {
    systemPrompt = "You are preparing a quiz for Grades 5-7. Theme: Space ships, planets, aliens, cosmic exploration. Focus on intermediate Math, Science, and English. Keep questions at a medium difficulty level requiring basic logic and conceptual understanding.";
  } else if (world === "Futuristic Mind Lab") {
    systemPrompt = "You are preparing a quiz for Grades 8-10. Theme: High-tech labs, neural networks, futuristic gadgets, cyber arenas. Focus strictly on advanced Math and Science. Questions must be analytical, application-based, and of higher difficulty. Emphasize speed, deeper application, and critical thinking.";
  }

  const prompt = `Generate exactly 5 multiple choice questions for a challenge of type: "${challengeType}".
${systemPrompt}
Output strictly as a JSON array where each object has:
{ "questionText": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "topic": "...", "difficulty": "..." }
Do not output markdown block formatting around the JSON, just the JSON string.`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('```json')) text = text.substring(7);
    if (text.startsWith('```')) text = text.substring(3);
    if (text.endsWith('```')) text = text.substring(0, text.length - 3);

    const data = JSON.parse(text.trim());
    
    const questions = data.map((q: any) => ({
      challengeId,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      topic: q.topic || "General",
      difficulty: q.difficulty || "Medium"
    }));

    await db.insert(challengeQuestions).values(questions);
  } catch (error) {
    logger.error({ err: error }, "Failed to generate AI questions, falling back to mock.");
    await generateMockQuestions(challengeId, world, challengeType);
  }
}

async function generateMockQuestions(challengeId: number, world: string, challengeType: string) {
  const fallbackList = getFallbackQuestions(world, 5);
  const questions = fallbackList.map((q: any) => ({
    challengeId,
    questionText: q.questionText,
    options: q.options,
    correctAnswer: q.correctAnswer,
    topic: q.topic || "General",
    difficulty: q.difficulty || "Medium"
  }));
  await db.insert(challengeQuestions).values(questions);
}
