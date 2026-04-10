/**
 * lib/reportGenerator.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates the daily progress report data for a student.
 * 
 * Sources:
 *   • session_logs  → active time slots, focused minutes, quests, XP, topics
 *   • daily_timetable → planned blocks (for schedule adherence calculation)
 *   • weekly_schedule → tomorrow's plan
 *   • users + parents → student name, parent info
 *
 * Called by:
 *   • lib/cron.ts           — at midnight IST for all students
 *   • routes/reports.ts     — /api/reports/trigger-test (manual trigger endpoint)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { db, users, parents, sessionLogs, dailyTimetable, weeklySchedule } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { format, addDays } from "date-fns";
import { generateEmailToken } from "./mailer.js";
import type { DailyReportData } from "./mailer.js";
import type { WhatsAppReportData } from "./twilio.js";

/** Returns "2026-04-07" in IST timezone */
function todayIST(offsetDays = 0): string {
  const now = new Date();
  // IST = UTC+5:30
  const ist = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) + offsetDays * 86400000);
  return ist.toISOString().slice(0, 10);
}

/** Format minutes to "4.5h" style */
function fmtHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10;
}

/** Format a Date to "09:30 AM" */
function fmtTime(d: Date): string {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

/** Format date to "Monday, 7 April 2026" */
function fmtDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export interface ReportOutput {
  email: DailyReportData;
  whatsapp: WhatsAppReportData;
  parentEmail: string;
  parentPhone: string;
}

export async function generateDailyReport(userId: number, dateStr?: string): Promise<ReportOutput | null> {
  const date = dateStr || todayIST(-1); // yesterday's report (sent at midnight)

  // 1. Fetch user + parent
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user || !user.parentId) return null;

  const [parent] = await db.select().from(parents).where(eq(parents.id, user.parentId));
  if (!parent || (!parent.emailVerified && !parent.phoneVerified)) return null;

  // 2. Fetch today's sessions
  const sessions = await db.select().from(sessionLogs).where(
    and(eq(sessionLogs.userId, userId), eq(sessionLogs.date, date))
  );

  // 3. Calculate stats
  const activeSlots = sessions
    .filter(s => s.startedAt && s.endedAt)
    .map(s => `${fmtTime(new Date(s.startedAt))} – ${fmtTime(new Date(s.endedAt!))}`);

  const totalFocusMinutes = sessions.reduce((acc, s) => acc + (s.focusMinutes || 0), 0);
  const totalActiveMinutes = sessions.reduce((acc, s) => {
    if (!s.endedAt) return acc;
    return acc + Math.round((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 60000);
  }, 0);

  const allQuestIds = [...new Set(sessions.flatMap(s => (s.questsCompleted as string[]) || []))];
  const allTopics   = [...new Set(sessions.flatMap(s => (s.topicsCovered as string[])   || []))];
  const totalXp     = sessions.reduce((acc, s) => acc + (s.xpEarned || 0), 0);

  // 4. Fetch today's timetable (for schedule adherence)
  const [timetable] = await db.select().from(dailyTimetable).where(
    and(eq(dailyTimetable.userId, userId), eq(dailyTimetable.date, date))
  );

  const plannedFocusBlocks = ((timetable?.blocks as any[]) || [])
    .filter((b: any) => b.type === "focus");

  const plannedSubjects = [...new Set(plannedFocusBlocks.map((b: any) => b.subject).filter(Boolean))];

  // Topics covered = intersect with planned
  const topicsCovered = plannedSubjects.map(sub => ({
    name: sub as string,
    completed: allTopics.some(t => t.toLowerCase().includes((sub as string).toLowerCase())),
  }));

  // Add any unplanned topics done today
  allTopics.forEach(t => {
    if (!topicsCovered.find(tc => tc.name.toLowerCase() === t.toLowerCase())) {
      topicsCovered.push({ name: t, completed: true });
    }
  });

  const completedCount = topicsCovered.filter(t => t.completed).length;
  const pendingCount   = topicsCovered.filter(t => !t.completed).length;
  const scheduleAdherence = pendingCount === 0
    ? "All topics completed as per plan ✅"
    : `${completedCount} completed · ${pendingCount} topic${pendingCount > 1 ? "s" : ""} pending ⚠️`;

  // 5. Tomorrow's plan — from weekly_schedule
  const tomorrowDate = todayIST(1);
  const tomorrowDay = new Date(tomorrowDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" }) as any;
  const DAY_MAP: Record<string, string> = { Sun: "Sun", Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat" };

  const [sched] = await db.select().from(weeklySchedule).where(eq(weeklySchedule.userId, userId));
  const tomorrowEntries = ((sched?.entries as any[]) || [])
    .filter((e: any) => e.day === DAY_MAP[tomorrowDay])
    .map((e: any) => ({
      time: e.startTime || "—",
      label: e.topic ? `${e.subject} — ${e.topic}` : e.subject,
      subject: e.subject,
    }));

  // 6. Build report token for parent view page
  const reportToken = generateEmailToken(parent.id);

  const email: DailyReportData = {
    studentName: user.fullName || user.name,
    parentName: parent.fullName,
    date: fmtDate(date),
    activeSlots,
    focusedHours: fmtHours(totalFocusMinutes),
    totalActiveHours: fmtHours(totalActiveMinutes),
    questsSolved: allQuestIds.length,
    pointsEarned: totalXp,
    topicsCovered,
    scheduleAdherence,
    tomorrowPlan: tomorrowEntries,
    reportToken,
  };

  const whatsapp: WhatsAppReportData = {
    studentName: email.studentName,
    date: email.date,
    focusedHours: email.focusedHours,
    totalActiveHours: email.totalActiveHours,
    questsSolved: email.questsSolved,
    pointsEarned: email.pointsEarned,
    scheduleAdherence: email.scheduleAdherence,
    topicsCovered: email.topicsCovered,
    tomorrowPlan: email.tomorrowPlan,
    reportLink: `${process.env.BASE_URL || "http://localhost:5173"}/parent-report/${reportToken}`,
  };

  return {
    email,
    whatsapp,
    parentEmail: parent.email,
    parentPhone: parent.phone,
  };
}
