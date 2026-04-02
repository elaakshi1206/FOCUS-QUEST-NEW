import "dotenv/config";
import { db } from "./index.js";
import { challenges, challengeQuestions, teams } from "./schema/index.js";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding challenges and questions...");

  // 1. Ensure we have mock teams for each world to attach challenges to
  await db.insert(teams).values([
    { id: 991, teamId: "mock-pirate-1", name: "Pirate Team 1", totalXp: 0, theme: "ocean" },
    { id: 992, teamId: "mock-space-1", name: "Space Team 1", totalXp: 0, theme: "space" },
    { id: 993, teamId: "mock-future-1", name: "Future Team 1", totalXp: 0, theme: "future" }
  ]).onConflictDoNothing();

  // --- World 1: Ocean Pirate Adventure ---
  const [oceanChallenge] = await db.insert(challenges).values({
    world: "Ocean Pirate Adventure",
    challengeType: "Emoji Math Race",
    status: "pending",
    team1Id: 991,
    settings: { questionsCount: 5 }
  }).returning();

  await db.insert(challengeQuestions).values([
    {
        challengeId: oceanChallenge.id,
        questionText: "If Captain Bluebeard has 5 🏴‍☠️ chests and finds 3 more, how many does he have in total?",
        options: ["7", "8", "9", "6"],
        correctAnswer: "8",
        topic: "Math",
        difficulty: "Easy"
    },
    {
        challengeId: oceanChallenge.id,
        questionText: "Which of these sea creatures has 8 arms?",
        options: ["🦀 Crab", "🐬 Dolphin", "🐙 Octopus", "🦈 Shark"],
        correctAnswer: "🐙 Octopus",
        topic: "EVS",
        difficulty: "Easy"
    },
    {
        challengeId: oceanChallenge.id,
        questionText: "What do pirates use to sail across the ocean?",
        options: ["A car", "A ship ⛵", "A bicycle", "A train"],
        correctAnswer: "A ship ⛵",
        topic: "English",
        difficulty: "Easy"
    }
  ]);

  // --- World 2: Space Explorer ---
  const [spaceChallenge] = await db.insert(challenges).values({
    world: "Space Explorer",
    challengeType: "Asteroid Word Problem Relay",
    status: "pending",
    team1Id: 992,
    settings: { questionsCount: 5 }
  }).returning();

  await db.insert(challengeQuestions).values([
    {
        challengeId: spaceChallenge.id,
        questionText: "A rocket travels at 10,000 km/hr. How far will it travel in 3.5 hours?",
        options: ["30,000 km", "35,000 km", "3,500 km", "40,000 km"],
        correctAnswer: "35,000 km",
        topic: "Math",
        difficulty: "Medium"
    },
    {
        challengeId: spaceChallenge.id,
        questionText: "Which planet is known as the Red Planet due to iron oxide on its surface?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correctAnswer: "Mars",
        topic: "Science",
        difficulty: "Medium"
    },
    {
        challengeId: spaceChallenge.id,
        questionText: "Identify the correct grammar: 'The astronauts ___ returning to Earth tomorrow.'",
        options: ["is", "was", "are", "have"],
        correctAnswer: "are",
        topic: "English",
        difficulty: "Medium"
    }
  ]);

  // --- World 3: Futuristic Mind Lab ---
  const [futureChallenge] = await db.insert(challenges).values({
    world: "Futuristic Mind Lab",
    challengeType: "Neural Network Puzzle Battle",
    status: "pending",
    team1Id: 993,
    settings: { questionsCount: 5 }
  }).returning();

  await db.insert(challengeQuestions).values([
    {
        challengeId: futureChallenge.id,
        questionText: "If quantum computer A processes data 3 times faster than B, and B completes a task in 12 seconds, how long does A take?",
        options: ["36 seconds", "4 seconds", "9 seconds", "6 seconds"],
        correctAnswer: "4 seconds",
        topic: "Logic Math",
        difficulty: "Hard"
    },
    {
        challengeId: futureChallenge.id,
        questionText: "In a controlled lab environment, which process releases energy by breaking down glucose?",
        options: ["Photosynthesis", "Cellular Respiration", "Mitosis", "Transcription"],
        correctAnswer: "Cellular Respiration",
        topic: "Biology",
        difficulty: "Hard"
    },
    {
        challengeId: futureChallenge.id,
        questionText: "Solve the neural puzzle sequence: 2, 6, 12, 20, ?",
        options: ["30", "28", "24", "40"],
        correctAnswer: "30",
        topic: "Reasoning",
        difficulty: "Hard"
    }
  ]);

  console.log("✅ Seed complete! Mock challenges created for all 3 worlds.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
