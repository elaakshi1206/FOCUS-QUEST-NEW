import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  teamId: text("team_id").notNull().unique(), // UUID string
  name: text("name").notNull(),
  avatar: text("avatar"), // emoji or image URL
  isPublic: boolean("is_public").default(true).notNull(),
  totalXp: integer("total_xp").default(0).notNull(),
  focusStreak: integer("focus_streak").default(0).notNull(),
  theme: text("theme").default("ocean").notNull(), // ocean, space, future
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").default("member").notNull(), // "owner" | "member"
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true });
export const selectTeamSchema = createSelectSchema(teams);
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
