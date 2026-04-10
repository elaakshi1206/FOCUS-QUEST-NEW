/**
 * routes/reports.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Manual report trigger and parent report view data.
 *
 * GET /api/reports/trigger-test/:userId  — Manually trigger report generation (dev tool)
 * GET /api/reports/view/:token           — Get report data for parent view page (by JWT token)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from "express";
import { dailyReportService } from "../services/DailyReportService.js";
import { db, parents, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { verifyEmailToken } from "../lib/mailer.js";
import { generateDailyReport as oldGenerateDailyReport } from "../lib/reportGenerator.js";

const router = Router();

// ─── GET /reports/trigger-test/:userId ───────────────────────────────────
// Manually run the report pipeline for a specific user (great for testing)
// Now using our new robust DailyReportService.
router.get("/trigger-test/:userId", async (req, res): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    let dateStr = req.query.date as string;
    if (!dateStr) {
      const today = new Date();
      dateStr = today.toISOString().split('T')[0];
    }

    const studentRows = await db.select().from(users).where(eq(users.id, userId));
    if (studentRows.length === 0) return res.status(404).json({ error: "Student not found" });
    const user = studentRows[0];

    if (!user.parentId) {
       return res.status(404).json({ error: "Could not generate report — user has no parent linked" });
    }

    const parentRows = await db.select().from(parents).where(eq(parents.id, user.parentId));
    if (parentRows.length === 0) return res.status(404).json({ error: "Parent not found" });
    const parent = parentRows[0];

    // Trigger report generation for this specific user manually
    await dailyReportService.generateAndSendReportForUser(userId, user, parent, dateStr);

    return res.json({
      success: true,
      message: `Report generated and sent for ${dateStr} (check console if in mock mode)`,
    });
  } catch (err) {
    console.error("Trigger test error:", err);
    return res.status(500).json({ error: "Failed to generate report" });
  }
});

// ─── GET /reports/view/:token ─────────────────────────────────────────────
// Parent clicks email link → frontend fetches data from this endpoint
router.get("/view/:token", async (req, res): Promise<any> => {
  try {
    const { token } = req.params;
    const payload = verifyEmailToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired report link" });
    }

    const [parent] = await db.select().from(parents).where(eq(parents.id, payload.parentId));
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    // Find the student linked to this parent
    const studentRows = await db.select().from(users).where(eq(users.parentId, parent.id));
    if (studentRows.length === 0) return res.status(404).json({ error: "Student not found" });

    const user = studentRows[0];

    // Generate fresh report data
    const report = await oldGenerateDailyReport(user.id);
    if (!report) {
      return res.json({
        parentName: parent.fullName,
        studentName: user.fullName || user.name,
        hasData: false,
        message: "No study data recorded yet",
      });
    }

    return res.json({ hasData: true, ...report.email });
  } catch (err) {
    console.error("Report view error:", err);
    return res.status(500).json({ error: "Failed to load report" });
  }
});

export default router;
