import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * A single schedule entry for one day slot.
 * mode='subject' → just stores subject name
 * mode='topic'   → stores subject + specific topic + time + duration
 */
export interface ScheduleEntry {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  subject: string;
  topic?: string;           // topic-wise mode only
  startTime?: string;       // "09:00"
  duration?: number;        // minutes
  icon?: string;
}

/**
 * Weekly schedule — one row per user.
 * entries: array of ScheduleEntry (can have multiple per day).
 */
export const weeklySchedule = pgTable("weekly_schedule", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mode: text("mode").default("subject").notNull(), // 'subject' | 'topic'
  entries: jsonb("entries").$type<ScheduleEntry[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWeeklyScheduleSchema = createInsertSchema(weeklySchedule).omit({ id: true, createdAt: true });
export const selectWeeklyScheduleSchema = createSelectSchema(weeklySchedule);
export type WeeklySchedule = typeof weeklySchedule.$inferSelect;
export type InsertWeeklySchedule = typeof weeklySchedule.$inferInsert;
