/**
 * lib/cron.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Midnight IST cron job that generates and sends daily progress reports.
 * 
 * Schedule: "0 18 * * *" UTC = 00:00 IST (UTC+5:30)
 *   → Runs every night at exactly midnight India Standard Time
 *
 * Process:
 *   1. Find all users who have a linked, verified parent
 *   2. Generate report data for each (via reportGenerator.ts)
 *   3. Send Email (via mailer.ts) + WhatsApp (via twilio.ts)
 *
 * Started from app.ts on server boot.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import cron from "node-cron";
import { logger } from "./logger.js";
import { dailyReportService } from "../services/DailyReportService.js";

// Prompt requested 0 0 * * * (every day at 00:00)
const CRON_SCHEDULE = "0 0 * * *";

export function startMidnightCron() {
  logger.info(`🕛 Midnight report cron registered — schedule: ${CRON_SCHEDULE}`);

  cron.schedule(CRON_SCHEDULE, async () => {
    logger.info("🌙 Running midnight daily report generation...");

    try {
      // Calculate 'yesterday' date string for exact match
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const dateStr = yesterday.toISOString().split('T')[0]; // e.g. "2026-04-10"

      await dailyReportService.generateReportsForDate(dateStr);
      logger.info(`✅ Midnight reports sequence completed for date: ${dateStr}`);
    } catch (err) {
      logger.error({ err }, "❌ Fatal error in midnight cron job");
    }
  });
}
