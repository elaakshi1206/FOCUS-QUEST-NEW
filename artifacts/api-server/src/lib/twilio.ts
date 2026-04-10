/**
 * lib/twilio.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Twilio wrapper for SMS OTP and WhatsApp messages.
 * • If TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN are set → real SMS/WhatsApp
 * • Otherwise → console mock (development mode)
 *
 * Connected to:
 *   • routes/auth.ts  — sends OTP during signup verification
 *   • lib/cron.ts     — sends WhatsApp daily reports at midnight IST
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TWILIO_SID   = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN   || "";
const TWILIO_FROM  = process.env.TWILIO_PHONE        || "+15005550006";
const WA_FROM      = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

const MOCK_MODE = !TWILIO_SID || !TWILIO_TOKEN;

// Lazy-load twilio client (only if credentials present)
let _twilioClient: any = null;
async function getClient() {
  if (MOCK_MODE) return null;
  if (!_twilioClient) {
    const twilio = await import("twilio");
    _twilioClient = twilio.default(TWILIO_SID, TWILIO_TOKEN);
  }
  return _twilioClient;
}

// ─── OTP helpers ──────────────────────────────────────────────────────────

export function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

export async function sendOTP(phone: string, otp: string): Promise<void> {
  const client = await getClient();
  if (!client) {
    console.log(`\n📱 [SMS MOCK] To: ${phone}\n   OTP: ${otp}\n   (Set TWILIO_* env vars to send real SMS)\n`);
    return;
  }
  await client.messages.create({
    body: `Your FocusQuest verification code is: ${otp}. Valid for 10 minutes. Do not share.`,
    from: TWILIO_FROM,
    to: phone,
  });
}

// ─── WhatsApp report ──────────────────────────────────────────────────────

export interface WhatsAppReportData {
  studentName: string;
  date: string;
  focusedHours: number;
  totalActiveHours: number;
  questsSolved: number;
  pointsEarned: number;
  scheduleAdherence: string;
  topicsCovered: Array<{ name: string; completed: boolean }>;
  tomorrowPlan: Array<{ time: string; label: string }>;
  reportLink: string;
}

export async function sendWhatsAppReport(phone: string, data: WhatsAppReportData): Promise<void> {
  const topics = data.topicsCovered
    .map(t => `${t.completed ? "✅" : "⏳"} ${t.name}`)
    .join("\n   ");

  const tomorrow = data.tomorrowPlan
    .slice(0, 5)
    .map(b => `   🕐 ${b.time} — ${b.label}`)
    .join("\n");

  const message = [
    `📊 *FocusQuest Daily Report*`,
    `👦 Student: *${data.studentName}*`,
    `📅 ${data.date}`,
    ``,
    `⏱️ *Study Time*`,
    `   🎯 Focused: *${data.focusedHours}h* of ${data.totalActiveHours}h active`,
    ``,
    `🏆 *Quest Performance*`,
    `   ⚔️ Quests solved: *${data.questsSolved}*`,
    `   ⚡ XP earned: *${data.pointsEarned}*`,
    ``,
    `📚 *Topics Today*`,
    `   ${topics || "No topics recorded"}`,
    ``,
    `📋 *Schedule*`,
    `   ${data.scheduleAdherence}`,
    ``,
    `📅 *Tomorrow's Plan (Top 5)*`,
    tomorrow || "   No schedule set",
    ``,
    `🔍 Full report: ${data.reportLink}`,
  ].join("\n");

  const client = await getClient();
  if (!client) {
    console.log(`\n💬 [WHATSAPP MOCK] To: ${phone}\n${message}\n   (Set TWILIO_* env vars to send real WhatsApp)\n`);
    return;
  }

  await client.messages.create({
    body: message,
    from: WA_FROM,
    to: `whatsapp:${phone}`,
  });
}
