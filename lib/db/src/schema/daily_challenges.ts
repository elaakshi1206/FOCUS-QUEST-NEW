import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const dailyQuiz = pgTable("daily_quiz", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // format YYYY-MM-DD
  gradeGroup: text("grade_group").notNull(), // '1-4', '5-7', '8-10'
  world: text("world").notNull().default("Ocean Pirate Adventure"),
  questions: jsonb("questions").notNull(), // 5-10 MCQs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailySubmissions = pgTable("daily_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  quizId: integer("quiz_id").references(() => dailyQuiz.id).notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  timeTaken: integer("time_taken").notNull(), // in milliseconds
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const dailyLeaderboard = pgTable("daily_leaderboard", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  gradeGroup: text("grade_group").notNull(),
  world: text("world").notNull().default("Ocean Pirate Adventure"),
  userId: integer("user_id").references(() => users.id).notNull(),
  score: integer("score").notNull(),
  timeTaken: integer("time_taken").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDailyQuizSchema = createInsertSchema(dailyQuiz).omit({ id: true, createdAt: true });
export const selectDailyQuizSchema = createSelectSchema(dailyQuiz);
export type DailyQuiz = typeof dailyQuiz.$inferSelect;

export const insertDailySubmissionSchema = createInsertSchema(dailySubmissions).omit({ id: true, submittedAt: true });
export const selectDailySubmissionSchema = createSelectSchema(dailySubmissions);
export type DailySubmission = typeof dailySubmissions.$inferSelect;

export const insertDailyLeaderboardSchema = createInsertSchema(dailyLeaderboard).omit({ id: true, updatedAt: true });
export const selectDailyLeaderboardSchema = createSelectSchema(dailyLeaderboard);
export type DailyLeaderboard = typeof dailyLeaderboard.$inferSelect;
