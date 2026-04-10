import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Parents table — linked to Students during signup.
 * Stores verification state for both phone (OTP) and email (magic token).
 * Used as the delivery target for daily midnight progress reports.
 */
export const parents = pgTable("parents", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),          // e.g. "+919876543210"
  email: text("email").notNull().unique(),
  phoneVerified: boolean("phone_verified").default(false).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  // OTP for phone verification (6-digit, stored hashed in prod; plain for dev)
  otpCode: text("otp_code"),
  otpExpiresAt: timestamp("otp_expires_at"),
  // Token for email verification / magic link
  emailToken: text("email_token"),
  emailTokenExpiresAt: timestamp("email_token_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertParentSchema = createInsertSchema(parents).omit({ id: true, createdAt: true });
export const selectParentSchema = createSelectSchema(parents);
export type Parent = typeof parents.$inferSelect;
export type InsertParent = typeof parents.$inferInsert;
