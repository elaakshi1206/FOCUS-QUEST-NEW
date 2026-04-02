import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { teams } from "./teams";

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  challengeType: text("challenge_type").notNull(),
  world: text("world").notNull(),
  status: text("status").default('pending').notNull(), // pending, active, completed
  team1Id: integer("team1_id").references(() => teams.id),
  team2Id: integer("team2_id").references(() => teams.id),
  winnerTeamId: integer("winner_team_id").references(() => teams.id),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  settings: jsonb("settings").default({}).notNull(),
});

export const challengeQuestions = pgTable("challenge_questions", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => challenges.id).notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options").notNull(), // string[]
  correctAnswer: text("correct_answer").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(),
});

export const challengeSubmissions = pgTable("challenge_submissions", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => challenges.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  questionId: integer("question_id").references(() => challengeQuestions.id).notNull(),
  answer: text("answer").notNull(),
  timeTaken: integer("time_taken").notNull(), // in milliseconds
  points: integer("points").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true });
export const selectChallengeSchema = createSelectSchema(challenges);
export type Challenge = typeof challenges.$inferSelect;

export const insertChallengeQuestionSchema = createInsertSchema(challengeQuestions).omit({ id: true });
export const selectChallengeQuestionSchema = createSelectSchema(challengeQuestions);
export type ChallengeQuestion = typeof challengeQuestions.$inferSelect;

export const insertChallengeSubmissionSchema = createInsertSchema(challengeSubmissions).omit({ id: true, submittedAt: true });
export const selectChallengeSubmissionSchema = createSelectSchema(challengeSubmissions);
export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect;
