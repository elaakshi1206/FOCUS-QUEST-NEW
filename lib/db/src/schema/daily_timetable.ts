import { pgTable, serial, integer, text, jsonb, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * A single time block in the daily timetable
 * (mirrors the TimeBlock interface already used in TimetableBuilder.tsx)
 */
export interface TimeBlock {
  label: string;
  time: string;
  duration: number;   // minutes
  type: "school" | "meal" | "play" | "break" | "activity" | "focus" | "sleep";
  subject?: string;
  topic?: string;
  focusPoints?: number;
  icon: string;
  completed?: boolean;
}

/**
 * Daily timetable — auto-generated each day from weekly_schedule.
 * One row per user per date.
 */
export const dailyTimetable = pgTable("daily_timetable", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),       // ISO date string "2026-04-07"
  blocks: jsonb("blocks").$type<TimeBlock[]>().default([]).notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export const insertDailyTimetableSchema = createInsertSchema(dailyTimetable).omit({ id: true });
export const selectDailyTimetableSchema = createSelectSchema(dailyTimetable);
export type DailyTimetable = typeof dailyTimetable.$inferSelect;
export type InsertDailyTimetable = typeof dailyTimetable.$inferInsert;
