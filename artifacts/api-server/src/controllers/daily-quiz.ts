import { Request, Response } from "express";
import { db } from "@workspace/db";
import { dailyQuiz, dailySubmissions, dailyLeaderboard, users } from "@workspace/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFallbackQuestions } from "../lib/questions";

const getSystemPromptForWorld = (worldName: string) => {
  if (worldName === "Ocean Pirate Adventure") {
    return "You are preparing a daily quiz for Grades 1-4. Theme: Pirate ships, ocean creatures, treasure hunts. Use pirate emojis like 🏴‍☠️🦜⚓. Focus on Basic Math (simple addition, subtraction), EVS (basic environment, ocean), and Basic English (simple grammar, vocabulary). Use simple language, easy examples, and avoid complex logic. Output exactly 10 multiple choice questions.";
  } else if (worldName === "Space Explorer") {
    return "You are preparing a daily quiz for Grades 5-7. Theme: Space ships, planets, aliens, cosmic exploration. Focus on intermediate Math, Science, and English. Keep questions at a medium difficulty level requiring basic logic and conceptual understanding. Output exactly 10 multiple choice questions.";
  } else {
    // Futuristic Mind Lab (8-10)
    return "You are preparing a daily quiz for Grades 8-10. Theme: High-tech labs, neural networks, futuristic gadgets, cyber arenas. Focus strictly on advanced Math and Science. Questions must be analytical, application-based, and of higher difficulty. Emphasize speed, deeper application, and critical thinking. Output exactly 10 multiple choice questions.";
  }
};

const generateDailyQuestions = async (world: string) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY_1;
  
  if (!apiKey) {
    logger.warn("No Gemini API key found, using real questions for daily challenge.");
    return getFallbackQuestions(world, 10);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = getSystemPromptForWorld(world);
  const prompt = `
${systemInstruction}
Return the quiz strictly as a JSON array where each object has:
{ "questionText": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A" }
Ensure the output is valid JSON so it can be parsed. Do not wrap in markdown or backticks.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('```json')) text = text.substring(7);
    if (text.startsWith('```')) text = text.substring(3);
    if (text.endsWith('```')) text = text.substring(0, text.length - 3);

    const questions = JSON.parse(text.trim());
    return questions;
  } catch (err) {
    logger.error({ err }, "Failed to generate AI daily questions. Falling back to real questions.");
    return getFallbackQuestions(world, 10);
  }
};

export const getDailyQuiz = async (req: Request, res: Response) => {
  try {
    const { grade, world } = req.query;
    if (!grade || !world) {
      return Object.assign(res.status(400).json({ error: "Grade and World parameters are required" }));
    }

    const gradeNumber = Number(grade);
    let gradeGroup = "1-4";
    if (gradeNumber >= 5 && gradeNumber <= 7) gradeGroup = "5-7";
    else if (gradeNumber >= 8) gradeGroup = "8-10";

    const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if quiz exists for today, this group, and this world
    let [quiz] = await db
      .select()
      .from(dailyQuiz)
      .where(and(eq(dailyQuiz.date, dateStr), eq(dailyQuiz.gradeGroup, gradeGroup), eq(dailyQuiz.world, String(world))));

    // Auto-repair legacy mock quizzes generated before the update
    if (quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0 && quiz.questions[0].questionText.includes("Mock Question")) {
      await db.delete(dailyQuiz).where(eq(dailyQuiz.id, quiz.id));
      quiz = undefined as any;
    }

    if (!quiz) {
      // Generate new quiz
      const questions = await generateDailyQuestions(String(world));
      
      [quiz] = await db.insert(dailyQuiz).values({
        date: dateStr,
        gradeGroup,
        world: String(world),
        questions
      }).returning();
    }

    return Object.assign(res.json(quiz));
  } catch (error) {
    logger.error({ err: error }, "Error fetching daily quiz");
    return Object.assign(res.status(500).json({ error: "Internal server error" }));
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { userId, quizId, correctAnswers, timeTaken } = req.body;
    
    // Check if user already submitted for this quiz to enforce 1 attempt
    const [existing] = await db.select()
      .from(dailySubmissions)
      .where(and(eq(dailySubmissions.userId, Number(userId)), eq(dailySubmissions.quizId, Number(quizId))));

    if (existing) {
      return Object.assign(res.status(400).json({ error: "You have already attempted today's challenge." }));
    }

    // Insert submission
    await db.insert(dailySubmissions).values({
      userId: Number(userId),
      quizId: Number(quizId),
      correctAnswers: Number(correctAnswers),
      timeTaken: Number(timeTaken)
    });

    // Also populate daily leaderboard
    // First figure out gradeGroup and date from the quiz
    const [quiz] = await db.select().from(dailyQuiz).where(eq(dailyQuiz.id, Number(quizId)));
    
    if (quiz) {
      await db.insert(dailyLeaderboard).values({
        date: quiz.date,
        gradeGroup: quiz.gradeGroup,
        world: quiz.world,
        userId: Number(userId),
        score: Number(correctAnswers),
        timeTaken: Number(timeTaken)
      });
    }

    return Object.assign(res.json({ success: true, message: "Submission recorded" }));
  } catch (error) {
    logger.error({ err: error }, "Error submitting daily quiz");
    return Object.assign(res.status(500).json({ error: "Internal server error" }));
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { grade, date, world } = req.query;
    if (!grade || !date || !world) {
      return Object.assign(res.status(400).json({ error: "Grade, Date, and World are required parameters" }));
    }

    const gradeNumber = Number(grade);
    let gradeGroup = "1-4";
    if (gradeNumber >= 5 && gradeNumber <= 7) gradeGroup = "5-7";
    else if (gradeNumber >= 8) gradeGroup = "8-10";

    const topUsers = await db.select({
      id: dailyLeaderboard.id,
      userId: dailyLeaderboard.userId,
      score: dailyLeaderboard.score,
      timeTaken: dailyLeaderboard.timeTaken,
      name: users.name
    })
    .from(dailyLeaderboard)
    .innerJoin(users, eq(dailyLeaderboard.userId, users.id))
    .where(and(
      eq(dailyLeaderboard.date, String(date)), 
      eq(dailyLeaderboard.gradeGroup, gradeGroup),
      eq(dailyLeaderboard.world, String(world))
    ))
    .orderBy(desc(dailyLeaderboard.score), asc(dailyLeaderboard.timeTaken))
    .limit(10);

    return Object.assign(res.json(topUsers));
  } catch (error) {
    logger.error({ err: error }, "Error fetching daily leaderboard");
    return Object.assign(res.status(500).json({ error: "Internal server error" }));
  }
};
