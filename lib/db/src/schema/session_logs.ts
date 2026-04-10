import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Records each focused study session.
 * A "session" = one continuous period the student is active on the map/quest.
 * Used by the report generator to calculate:
 *   - Active time slots (e.g. "09:30 AM – 10:45 AM")
 *   - Total focused study hours
 *   - Topics covered and quests solved per session
 */
export const sessionLogs = pgTable("session_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),                           // "2026-04-07" (IST)
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  focusMinutes: integer("focus_minutes").default(0),
  xpEarned: integer("xp_earned").default(0),
  questsCompleted: jsonb("quests_completed").$type<string[]>().default([]),   // quest IDs
  topicsCovered: jsonb("topics_covered").$type<string[]>().default([]),        // subject/topic labels
});

export const insertSessionLogSchema = createInsertSchema(sessionLogs).omit({ id: true });
export const selectSessionLogSchema = createSelectSchema(sessionLogs);
export type SessionLog = typeof sessionLogs.$inferSelect;
export type InsertSessionLog = typeof sessionLogs.$inferInsert;
