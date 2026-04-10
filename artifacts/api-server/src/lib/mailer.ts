/**
 * lib/mailer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Nodemailer wrapper for FocusQuest.
 * • If GMAIL_USER / GMAIL_PASS are set   → sends real emails via Gmail SMTP
 * • Otherwise                            → logs the email to console (dev mock)
 *
 * Connected to:
 *   • routes/auth.ts     — sends verification links during signup
 *   • lib/cron.ts        — sends daily progress reports at midnight IST
 * ─────────────────────────────────────────────────────────────────────────────
 */

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_PASS = process.env.GMAIL_PASS || "";
const JWT_SECRET = process.env.JWT_SECRET || "focusquest_dev_secret";
const BASE_URL   = process.env.BASE_URL   || "http://localhost:5173";
const FROM       = process.env.EMAIL_FROM || "FocusQuest <noreply@focusquest.app>";

const MOCK_MODE = !GMAIL_USER || !GMAIL_PASS;

const transporter = MOCK_MODE
  ? null
  : nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });

// ─── helpers ──────────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string, text: string) {
  if (MOCK_MODE || !transporter) {
    console.log(`\n📧  [EMAIL MOCK] To: ${to}\n    Subject: ${subject}\n    Text: ${text}\n`);
    return;
  }
  await transporter.sendMail({ from: FROM, to, subject, html, text });
}

// ─── Verification email ───────────────────────────────────────────────────

export function generateEmailToken(parentId: number): string {
  return jwt.sign({ parentId, purpose: "email-verify" }, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyEmailToken(token: string): { parentId: number } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.purpose !== "email-verify") return null;
    return { parentId: payload.parentId };
  } catch {
    return null;
  }
}

export async function sendVerificationEmail(to: string, parentId: number, parentName: string) {
  const token = generateEmailToken(parentId);
  const link  = `${BASE_URL}/parent-verify?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f172a; margin: 0; padding: 20px; }
        .card { background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid #334155;
                border-radius: 20px; max-width: 520px; margin: auto; padding: 40px; color: #e2e8f0; }
        h1 { color: #38bdf8; font-size: 28px; margin-bottom: 8px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6);
               color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px;
               font-size: 16px; font-weight: 700; margin: 24px 0; }
        .note { font-size: 13px; color: #64748b; margin-top: 8px; }
        .badge { background: #1e3a5f; border-radius: 8px; padding: 8px 14px; font-size: 13px;
                 color: #93c5fd; display: inline-block; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">🎮 FocusQuest Parent Portal</div>
        <h1>Welcome, ${parentName}! 👋</h1>
        <p>Your child has been registered on <strong>FocusQuest</strong> — the gamified learning platform that turns study time into epic quests!</p>
        <p>Please verify your email address to activate your parent account and start receiving daily progress reports.</p>
        <a href="${link}" class="btn">✅ Verify My Email</a>
        <p class="note">This link expires in 24 hours. If you didn't sign up, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;

  const text = `Hi ${parentName},\n\nVerify your email for FocusQuest: ${link}\n\nThis link expires in 24h.`;
  await send(to, "✅ Verify your FocusQuest parent email", html, text);
}

// ─── Daily progress report email ─────────────────────────────────────────

export interface DailyReportData {
  studentName: string;
  parentName: string;
  date: string;               // "Monday, 7 April 2026"
  activeSlots: string[];      // e.g. ["09:30 AM – 10:45 AM", "02:00 PM – 03:20 PM"]
  focusedHours: number;       // e.g. 4.5
  totalActiveHours: number;   // e.g. 6.2
  questsSolved: number;
  pointsEarned: number;
  topicsCovered: Array<{ name: string; completed: boolean }>;
  scheduleAdherence: string;  // e.g. "All topics completed ✅" or "2 topics pending ⚠️"
  tomorrowPlan: Array<{ time: string; label: string; subject?: string }>;
  reportToken: string;        // JWT for parent report view
}

export async function sendDailyReport(to: string, data: DailyReportData) {
  const reportLink = `${BASE_URL}/parent-report/${data.reportToken}`;

  const topicsHtml = data.topicsCovered.map(t =>
    `<li style="margin:4px 0;">${t.completed ? "✅" : "⏳"} ${t.name}</li>`
  ).join("");

  const tomorrowHtml = data.tomorrowPlan.map(b =>
    `<li style="margin:4px 0;">🕐 <strong>${b.time}</strong> — ${b.label}${b.subject ? ` (${b.subject})` : ""}</li>`
  ).join("");

  const slotsHtml = data.activeSlots.map(s =>
    `<span style="background:#1e3a5f;padding:4px 10px;border-radius:6px;margin:3px;display:inline-block;">🟢 ${s}</span>`
  ).join(" ");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f172a; margin: 0; padding: 20px; }
        .card { background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid #334155;
                border-radius: 20px; max-width: 600px; margin: auto; padding: 36px; color: #e2e8f0; }
        h1 { color: #38bdf8; font-size: 24px; margin: 0 0 4px; }
        .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
        .section { background: rgba(255,255,255,0.04); border: 1px solid #334155;
                   border-radius: 14px; padding: 18px 20px; margin: 16px 0; }
        .section h2 { color: #a78bfa; font-size: 15px; margin: 0 0 12px; letter-spacing: 0.05em; text-transform: uppercase; }
        .stat { display: inline-block; background: #1e3a5f; border-radius: 10px;
                padding: 10px 18px; margin: 4px; text-align: center; }
        .stat-num { font-size: 26px; font-weight: 800; color: #38bdf8; display: block; }
        .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
        .adherence { padding: 12px 18px; border-radius: 10px; font-weight: 700; font-size: 15px; margin-top: 10px; }
        .adherence.good { background: rgba(52,211,153,0.15); color: #34d399; }
        .adherence.warn { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6);
               color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 12px;
               font-size: 15px; font-weight: 700; margin-top: 24px; }
        ul { margin: 0; padding-left: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>📊 Daily Progress Report</h1>
        <p class="subtitle">FocusQuest · ${data.date} · ${data.studentName}'s Quest Summary</p>

        <div class="section">
          <h2>⏱️ Active Study Slots</h2>
          ${slotsHtml || '<em style="color:#475569">No sessions recorded today</em>'}
        </div>

        <div class="section">
          <h2>📈 Study Stats</h2>
          <div class="stat"><span class="stat-num">${data.focusedHours}h</span><span class="stat-label">Focused Hours</span></div>
          <div class="stat"><span class="stat-num">${data.totalActiveHours}h</span><span class="stat-label">Active Hours</span></div>
          <div class="stat"><span class="stat-num">${data.questsSolved}</span><span class="stat-label">Quests Solved</span></div>
          <div class="stat"><span class="stat-num">${data.pointsEarned}</span><span class="stat-label">XP Earned</span></div>
        </div>

        <div class="section">
          <h2>📚 Topics Covered</h2>
          <ul>${topicsHtml || "<li>No topics recorded</li>"}</ul>
          <div class="adherence ${data.scheduleAdherence.includes("✅") ? "good" : "warn"}">
            ${data.scheduleAdherence}
          </div>
        </div>

        <div class="section">
          <h2>📅 Tomorrow's Plan</h2>
          <ul>${tomorrowHtml || "<li>No schedule set for tomorrow</li>"}</ul>
        </div>

        <div style="text-align:center;">
          <a href="${reportLink}" class="btn">🔍 View Full Report</a>
          <p style="color:#64748b;font-size:12px;margin-top:12px;">Report valid for 48 hours · Sent by FocusQuest</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = [
    `Daily Progress Report — ${data.date}`,
    `Student: ${data.studentName}`,
    `Active sessions: ${data.activeSlots.join(", ") || "None"}`,
    `Focused: ${data.focusedHours}h of ${data.totalActiveHours}h`,
    `Quests solved: ${data.questsSolved} | XP earned: ${data.pointsEarned}`,
    `Topics: ${data.topicsCovered.map(t => (t.completed ? "✓ " : "○ ") + t.name).join(", ")}`,
    `Schedule: ${data.scheduleAdherence}`,
    `Full report: ${reportLink}`,
  ].join("\n");

  await send(to, `📊 ${data.studentName}'s FocusQuest Report — ${data.date}`, html, text);
}
