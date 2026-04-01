import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  focusScore: integer("focus_score").default(0).notNull(),
  totalXp: integer("total_xp").default(0).notNull(),
  difficultyLevel: text("difficulty_level").default("Beginner").notNull(), // Beginner, Intermediate, Advanced
  learningTopics: jsonb("learning_topics").$type<string[]>().default([]).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  improvementRate: integer("improvement_rate").default(0).notNull(),
  theme: text("theme").default("ocean").notNull(), // ocean, space, future
  grade: integer("grade").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
