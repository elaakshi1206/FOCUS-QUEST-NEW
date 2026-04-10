/**
 * routes/sessions.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Study session tracking routes.
 *
 * POST /api/sessions/start         — Log when student starts a study session
 * POST /api/sessions/end           — Log session end with stats
 * GET  /api/sessions/:userId/today — Get today's session summary
 *
 * Sessions feed directly into daily report generation (reportGenerator.ts).
 * The frontend calls start on Map mount and end on unmount / navigation away.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from "express";
import { db, sessionLogs, users } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

/** Returns today's date in IST as "YYYY-MM-DD" */
function todayIST(): string {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

// ─── POST /sessions/start ─────────────────────────────────────────────────
router.post("/start", async (req, res): Promise<any> => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const [session] = await db.insert(sessionLogs).values({
      userId: parseInt(userId),
      date: todayIST(),
      startedAt: new Date(),
      focusMinutes: 0,
      xpEarned: 0,
      questsCompleted: [],
      topicsCovered: [],
    }).returning();

    return res.json({ success: true, sessionId: session.id });
  } catch (err) {
    console.error("Session start error:", err);
    return res.status(500).json({ error: "Failed to start session" });
  }
});

// ─── POST /sessions/end ───────────────────────────────────────────────────
router.post("/end", async (req, res): Promise<any> => {
  try {
    const { sessionId, focusMinutes, xpEarned, questsCompleted, topicsCovered } = req.body;
    if (!sessionId) return res.status(400).json({ error: "sessionId is required" });

    const [session] = await db.select().from(sessionLogs).where(eq(sessionLogs.id, parseInt(sessionId)));
    if (!session) return res.status(404).json({ error: "Session not found" });

    const endedAt = new Date();
    const actualMinutes = Math.round((endedAt.getTime() - new Date(session.startedAt).getTime()) / 60000);

    await db.update(sessionLogs).set({
      endedAt,
      focusMinutes: focusMinutes ?? actualMinutes,
      xpEarned: xpEarned ?? 0,
      questsCompleted: questsCompleted ?? [],
      topicsCovered: topicsCovered ?? [],
    }).where(eq(sessionLogs.id, session.id));

    return res.json({ success: true, durationMinutes: actualMinutes });
  } catch (err) {
    console.error("Session end error:", err);
    return res.status(500).json({ error: "Failed to end session" });
  }
});

// ─── GET /sessions/:userId/today ──────────────────────────────────────────
router.get("/:userId/today", async (req, res): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const today = todayIST();
    const sessions = await db.select().from(sessionLogs).where(
      and(eq(sessionLogs.userId, userId), eq(sessionLogs.date, today))
    );

    const totalFocusMinutes = sessions.reduce((acc, s) => acc + (s.focusMinutes || 0), 0);
    const totalXp = sessions.reduce((acc, s) => acc + (s.xpEarned || 0), 0);
    const allQuests = [...new Set(sessions.flatMap(s => (s.questsCompleted as string[]) || []))];
    const allTopics = [...new Set(sessions.flatMap(s => (s.topicsCovered as string[]) || []))];

    const activeSlots = sessions
      .filter(s => s.endedAt)
      .map(s => {
        const start = new Date(s.startedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
        const end   = new Date(s.endedAt!).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
        return `${start} – ${end}`;
      });

    return res.json({
      date: today,
      sessions: sessions.length,
      activeSlots,
      totalFocusMinutes,
      totalFocusHours: Math.round((totalFocusMinutes / 60) * 10) / 10,
      totalXp,
      questsSolved: allQuests.length,
      topicsCovered: allTopics,
    });
  } catch (err) {
    console.error("Today sessions error:", err);
    return res.status(500).json({ error: "Failed to fetch session summary" });
  }
});

export default router;
