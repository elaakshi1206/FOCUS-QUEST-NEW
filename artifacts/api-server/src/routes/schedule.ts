/**
 * routes/schedule.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Weekly schedule + daily timetable routes.
 *
 * GET  /api/schedule/:userId           — Get saved weekly schedule
 * POST /api/schedule/:userId           — Save/update weekly schedule
 * GET  /api/schedule/:userId/today     — Get today's timetable (auto-generate if missing)
 * POST /api/schedule/:userId/generate  — (Re)generate today's timetable from weekly schedule
 *
 * Connected to:
 *   • DB: weekly_schedule, daily_timetable, users
 *   • lib/reportGenerator.ts — tomorrow's plan for daily reports
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from "express";
import { db, users, weeklySchedule, dailyTimetable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import type { ScheduleEntry } from "@workspace/db";

const router = Router();

/** Returns today's date in IST as "YYYY-MM-DD" */
function todayIST(): string {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Maps entries for a given day-of-week into TimeBlock format for timetable */
function entriesToBlocks(entries: ScheduleEntry[], dayStr: string) {
  const dayEntries = entries.filter(e => e.day === dayStr);
  return dayEntries.map(e => ({
    label: e.topic ? `${e.subject} — ${e.topic}` : `Focus Quest – ${e.subject}`,
    time: e.startTime || "16:00",
    duration: e.duration || 45,
    type: "focus" as const,
    subject: e.subject,
    topic: e.topic,
    focusPoints: Math.round((e.duration || 45) * 3.5),
    icon: "⚡",
    completed: false,
  }));
}

// ─── GET /schedule/:userId ────────────────────────────────────────────────
router.get("/:userId", async (req, res): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const [sched] = await db.select().from(weeklySchedule).where(eq(weeklySchedule.userId, userId));
    if (!sched) return res.json({ exists: false, entries: [], mode: "subject" });

    return res.json({
      exists: true,
      id: sched.id,
      mode: sched.mode,
      entries: sched.entries,
      updatedAt: sched.updatedAt,
    });
  } catch (err) {
    console.error("Get schedule error:", err);
    return res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// ─── POST /schedule/:userId ───────────────────────────────────────────────
router.post("/:userId", async (req, res): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const { mode, entries } = req.body as { mode: string; entries: ScheduleEntry[] };
    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ error: "entries must be an array" });
    }

    const now = new Date();
    const [existing] = await db.select().from(weeklySchedule).where(eq(weeklySchedule.userId, userId));

    if (existing) {
      const [updated] = await db
        .update(weeklySchedule)
        .set({ mode: mode || "subject", entries, updatedAt: now })
        .where(eq(weeklySchedule.id, existing.id))
        .returning();
      return res.json({ success: true, schedule: updated });
    } else {
      const [created] = await db
        .insert(weeklySchedule)
        .values({ userId, mode: mode || "subject", entries })
        .returning();
      return res.json({ success: true, schedule: created });
    }
  } catch (err) {
    console.error("Save schedule error:", err);
    return res.status(500).json({ error: "Failed to save schedule" });
  }
});

// ─── GET /schedule/:userId/today ──────────────────────────────────────────
router.get("/:userId/today", async (req, res): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const today = todayIST();

    // Check if already generated
    const [existing] = await db.select().from(dailyTimetable).where(
      and(eq(dailyTimetable.userId, userId), eq(dailyTimetable.date, today))
    );

    if (existing) {
      return res.json({ date: today, blocks: existing.blocks, cached: true });
    }

    // Auto-generate from weekly schedule
    const [sched] = await db.select().from(weeklySchedule).where(eq(weeklySchedule.userId, userId));
    if (!sched) {
      return res.json({ date: today, blocks: [], cached: false, message: "No schedule set yet" });
    }

    const dayStr = DAY_NAMES[new Date().getDay()];
    const focusBlocks = entriesToBlocks(sched.entries as ScheduleEntry[], dayStr);

    // Wrap with standard daily structure
    const blocks = [
      { label: "Morning Routine", time: "06:30", duration: 30, type: "break" as const, icon: "🌅", completed: false },
      { label: "Breakfast", time: "07:30", duration: 30, type: "meal" as const, icon: "🥞", completed: false },
      { label: "School Time", time: "08:30", duration: 390, type: "school" as const, icon: "🏫", completed: false },
      { label: "Lunch & Rest", time: "15:00", duration: 60, type: "meal" as const, icon: "🍱", completed: false },
      ...focusBlocks,
      { label: "Play Time", time: "19:00", duration: 60, type: "play" as const, icon: "🎮", completed: false },
      { label: "Dinner", time: "20:00", duration: 45, type: "meal" as const, icon: "🍛", completed: false },
      { label: "Sleep", time: "22:00", duration: 0, type: "sleep" as const, icon: "🌙", completed: false },
    ];

    // Persist
    await db.insert(dailyTimetable).values({ userId, date: today, blocks });

    return res.json({ date: today, blocks, cached: false, dayOfWeek: dayStr });
  } catch (err) {
    console.error("Get today error:", err);
    return res.status(500).json({ error: "Failed to get today's timetable" });
  }
});

// ─── POST /schedule/:userId/generate ─────────────────────────────────────
// Force regenerate today's timetable (e.g. after schedule edit)
router.post("/:userId/generate", async (req, res): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const today = todayIST();

    // Delete existing
    await db.delete(dailyTimetable).where(
      and(eq(dailyTimetable.userId, userId), eq(dailyTimetable.date, today))
    );

    const [sched] = await db.select().from(weeklySchedule).where(eq(weeklySchedule.userId, userId));
    if (!sched) return res.status(404).json({ error: "No schedule found to generate from" });

    const dayStr = DAY_NAMES[new Date().getDay()];
    const focusBlocks = entriesToBlocks(sched.entries as ScheduleEntry[], dayStr);

    const blocks = [
      { label: "Morning Routine", time: "06:30", duration: 30, type: "break" as const, icon: "🌅", completed: false },
      { label: "Breakfast", time: "07:30", duration: 30, type: "meal" as const, icon: "🥞", completed: false },
      { label: "School Time", time: "08:30", duration: 390, type: "school" as const, icon: "🏫", completed: false },
      { label: "Lunch & Rest", time: "15:00", duration: 60, type: "meal" as const, icon: "🍱", completed: false },
      ...focusBlocks,
      { label: "Play Time", time: "19:00", duration: 60, type: "play" as const, icon: "🎮", completed: false },
      { label: "Dinner", time: "20:00", duration: 45, type: "meal" as const, icon: "🍛", completed: false },
      { label: "Sleep", time: "22:00", duration: 0, type: "sleep" as const, icon: "🌙", completed: false },
    ];

    await db.insert(dailyTimetable).values({ userId, date: today, blocks });

    return res.json({ success: true, date: today, blocks, dayOfWeek: dayStr });
  } catch (err) {
    console.error("Generate timetable error:", err);
    return res.status(500).json({ error: "Failed to generate timetable" });
  }
});

export default router;
