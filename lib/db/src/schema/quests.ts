import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { teams } from "./teams";

export const teamQuests = pgTable("team_quests", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  objectiveType: text("objective_type").notNull(), // lessons, streak, xp, help
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0).notNull(),
  rewardXp: integer("reward_xp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTeamQuestSchema = createInsertSchema(teamQuests).omit({ id: true, createdAt: true });
export const selectTeamQuestSchema = createSelectSchema(teamQuests);
export type TeamQuest = typeof teamQuests.$inferSelect;
