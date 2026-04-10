import { pgTable, serial, integer, text, jsonb, timestamp, decimal, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

/**
 * Daily Activity Reports table
 * Stores the compiled daily report for each student, triggered at midnight.
 */
export const dailyActivityReports = pgTable("daily_activity_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  reportDate: date("report_date").notNull(),                   // The day the report is for, e.g. '2026-05-14'
  activeTimeSlots: jsonb("active_time_slots").$type<string[]>().default([]).notNull(), // ["3:45 PM – 4:20 PM", "5:10 PM – 6:00 PM"]
  totalActiveMinutes: integer("total_active_minutes").default(0).notNull(),
  focusedMinutes: integer("focused_minutes").default(0).notNull(),
  focusEfficiency: decimal("focus_efficiency", { precision: 5, scale: 2 }).default("0.00").notNull(), // % e.g., 73.00
  questsCompleted: integer("quests_completed").default(0).notNull(),
  avgQuestScore: decimal("avg_quest_score", { precision: 5, scale: 2 }).default("0.00").notNull(),
  topicsCovered: jsonb("topics_covered").$type<string[]>().default([]).notNull(),
  scheduleStatus: text("schedule_status").notNull(),           // "Completed 4/5 Planned Topics"
  completedTopics: integer("completed_topics").default(0).notNull(),
  totalPlannedTopics: integer("total_planned_topics").default(0).notNull(),
  nextDayPlan: jsonb("next_day_plan").$type<string[]>().default([]).notNull(), // ["Mathematics → Fractions Level 4", ...]
  whatsappSent: boolean("whatsapp_sent").default(false).notNull(),
  emailSent: boolean("email_sent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyActivityReportSchema = createInsertSchema(dailyActivityReports).omit({ id: true, createdAt: true });
export const selectDailyActivityReportSchema = createSelectSchema(dailyActivityReports);
export type DailyActivityReport = typeof dailyActivityReports.$inferSelect;
export type InsertDailyActivityReport = typeof dailyActivityReports.$inferInsert;
