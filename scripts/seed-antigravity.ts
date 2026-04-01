/**
 * seed.ts – Sample data for Antigravity module testing
 *
 * Run with:  npx tsx scripts/seed-antigravity.ts
 * (Requires DATABASE_URL env var to be set)
 */

import { db } from "@workspace/db";
import { users, teams, teamMembers, teamQuests } from "@workspace/db/schema";

async function seed() {
  console.log("🌱  Seeding Antigravity sample data…");

  // ── 1. Users ──────────────────────────────────────────────────────────────
  const insertedUsers = await db.insert(users).values([
    {
      name: "Aisha K.",
      email: "aisha@focusquest.dev",
      focusScore: 92,
      totalXp: 18_500,
      difficultyLevel: "Advanced",
      learningTopics: ["Algebra", "Physics", "Chemistry"],
      currentStreak: 21,
      improvementRate: 18,
    },
    {
      name: "Dev P.",
      email: "dev@focusquest.dev",
      focusScore: 85,
      totalXp: 15_200,
      difficultyLevel: "Advanced",
      learningTopics: ["Physics", "Computer Science"],
      currentStreak: 14,
      improvementRate: 12,
    },
    {
      name: "Rohan M.",
      email: "rohan@focusquest.dev",
      focusScore: 78,
      totalXp: 11_800,
      difficultyLevel: "Intermediate",
      learningTopics: ["Algebra", "Biology"],
      currentStreak: 10,
      improvementRate: 9,
    },
    {
      name: "Priya S.",
      email: "priya@focusquest.dev",
      focusScore: 71,
      totalXp: 9_300,
      difficultyLevel: "Intermediate",
      learningTopics: ["History", "English"],
      currentStreak: 7,
      improvementRate: 6,
    },
    {
      name: "Sam Q.",
      email: "sam@focusquest.dev",
      focusScore: 66,
      totalXp: 7_600,
      difficultyLevel: "Beginner",
      learningTopics: ["Algebra", "History"],
      currentStreak: 5,
      improvementRate: 4,
    },
    {
      name: "Nina L.",
      email: "nina@focusquest.dev",
      focusScore: 62,
      totalXp: 6_100,
      difficultyLevel: "Beginner",
      learningTopics: ["Biology", "Geography"],
      currentStreak: 4,
      improvementRate: 3,
    },
  ]).returning();
  console.log(`✅  Inserted ${insertedUsers.length} users`);

  // ── 2. Teams ──────────────────────────────────────────────────────────────
  const insertedTeams = await db.insert(teams).values([
    {
      teamId: crypto.randomUUID(),
      name: "Stellar Minds",
      avatar: "🌟",
      isPublic: true,
      totalXp: 52_400,
      focusStreak: 14,
    },
    {
      teamId: crypto.randomUUID(),
      name: "Quantum Crew",
      avatar: "⚡",
      isPublic: true,
      totalXp: 45_100,
      focusStreak: 10,
    },
    {
      teamId: crypto.randomUUID(),
      name: "Nova Squad",
      avatar: "🚀",
      isPublic: false,
      totalXp: 38_700,
      focusStreak: 7,
    },
  ]).returning();
  console.log(`✅  Inserted ${insertedTeams.length} teams`);

  // ── 3. Team Members ───────────────────────────────────────────────────────
  const stellarId = insertedTeams[0].id;
  const quantumId = insertedTeams[1].id;

  await db.insert(teamMembers).values([
    { teamId: stellarId, userId: insertedUsers[0].id, role: "owner" },
    { teamId: stellarId, userId: insertedUsers[1].id, role: "member" },
    { teamId: stellarId, userId: insertedUsers[2].id, role: "member" },
    { teamId: stellarId, userId: insertedUsers[3].id, role: "member" },
    { teamId: quantumId, userId: insertedUsers[4].id, role: "owner" },
    { teamId: quantumId, userId: insertedUsers[5].id, role: "member" },
  ]);
  console.log("✅  Assigned team members");

  // ── 4. Team Quests ────────────────────────────────────────────────────────
  const now = new Date();
  const inOneWeek  = new Date(now.getTime() + 7  * 86400_000);
  const inOneDay   = new Date(now.getTime() + 1  * 86400_000);
  const in12Hours  = new Date(now.getTime() + 12 * 3600_000);

  await db.insert(teamQuests).values([
    {
      teamId: stellarId,
      title: "Weekly Knowledge Sprint",
      description: "Complete 10 lessons together this week",
      objectiveType: "lessons",
      targetValue: 10,
      currentValue: 6,
      rewardXp: 500,
      expiresAt: inOneWeek,
    },
    {
      teamId: stellarId,
      title: "Streak Masters",
      description: "Maintain a combined 7-day focus streak",
      objectiveType: "streak",
      targetValue: 7,
      currentValue: 7,
      rewardXp: 350,
      expiresAt: inOneDay,
    },
    {
      teamId: stellarId,
      title: "XP Rush",
      description: "Score at least 2000 team XP in 24 hours",
      objectiveType: "xp",
      targetValue: 2000,
      currentValue: 1240,
      rewardXp: 800,
      expiresAt: in12Hours,
    },
    {
      teamId: quantumId,
      title: "Helper Heroes",
      description: "Help 3 teammates improve their personal difficulty level",
      objectiveType: "help",
      targetValue: 3,
      currentValue: 1,
      rewardXp: 450,
      expiresAt: inOneWeek,
    },
  ]);
  console.log("✅  Created team quests");

  console.log("\n🎉  Done! Antigravity seed data inserted successfully.");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
