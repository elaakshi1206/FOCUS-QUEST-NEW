import twilio from "twilio";
import nodemailer from "nodemailer";
import { logger } from "../lib/logger.js";

/**
 * ReportSenderService
 * Handles delivery of generated daily reports to parents via WhatsApp and Email.
 * Implements a fail-safe retry mechanism (up to 3 retries).
 */
export class ReportSenderService {
  private twilioClient: twilio.Twilio;
  private transporter: nodemailer.Transporter;

  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID || "AC_mock_sid",
      process.env.TWILIO_AUTH_TOKEN || "mock_token"
    );

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || "user",
        pass: process.env.SMTP_PASS || "pass",
      },
    });
  }

  /**
   * Automatically retry an async function up to maxRetries.
   */
  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          logger?.error(`[DAILY-REPORT] All ${maxRetries} retries failed.`);
          throw error;
        }
        logger?.warn(`[DAILY-REPORT] Attempt ${attempt} failed. Retrying...`);
        // wait before retry (exponential backoff could be added here)
        await new Promise((res) => setTimeout(res, 1000 * attempt));
      }
    }
    throw new Error("Unreachable");
  }

  /**
   * Sends the formatted daily report string via Twilio WhatsApp API.
   * Handles E.164 phone number formatting via Twilio client.
   * 
   * @param parentPhone Parent's phone number without 'whatsapp:' prefix
   * @param reportText The exact formatted string report
   */
  async sendWhatsAppReport(parentPhone: string, reportText: string): Promise<boolean> {
    if (!process.env.TWILIO_ACCOUNT_SID) {
      logger?.warn(`[DAILY-REPORT] Missing Twilio credentials. Simulating WhatsApp to ${parentPhone}`);
      logger?.info(reportText);
      return true;
    }

    try {
      await this.withRetry(async () => {
        await this.twilioClient.messages.create({
          body: reportText,
          from: process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886", // default twilio sandbox number
          to: `whatsapp:${parentPhone}`,
        });
      });
      logger?.info(`[DAILY-REPORT] WhatsApp report sent successfully to ${parentPhone}`);
      return true;
    } catch (error) {
      logger?.error(`[DAILY-REPORT] Failed to send WhatsApp to ${parentPhone}:`, error);
      return false; // Swallow error to prevent full service crash, but return false for tracking
    }
  }

  /**
   * Sends an email version of the report using Nodemailer.
   */
  async sendEmailReport(parentEmail: string, reportText: string, childName: string): Promise<boolean> {
    if (!process.env.SMTP_HOST) {
      logger?.warn(`[DAILY-REPORT] Missing SMTP credentials. Simulating Email to ${parentEmail}`);
      logger?.info(`Email Subject: FocusQuest Daily Report - ${childName}\n\n${reportText}`);
      return true;
    }

    // A simple conversion of plain text report to HTML by replacing newlines with <br>
    const reportHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #4F46E5;">FocusQuest Daily Progress</h2>
        <p>Hello! Here is the learning summary for today.</p>
        <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; border: 1px solid #E5E7EB;">
          ${reportText.replace(/\n/g, "<br>")}
        </div>
        <p style="font-size: 12px; color: #6B7280; margin-top: 20px;">
          Keep learning! The FocusQuest Team.
        </p>
      </div>
    `;

    try {
      await this.withRetry(async () => {
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || '"FocusQuest" <noreply@focusquest.com>',
          to: parentEmail,
          subject: `FocusQuest Daily Report: ${childName}`,
          text: reportText, // plain-text fallback
          html: reportHtml, // clean html version
        });
      });
      logger?.info(`[DAILY-REPORT] Email report sent successfully to ${parentEmail}`);
      return true;
    } catch (error) {
      logger?.error(`[DAILY-REPORT] Failed to send Email to ${parentEmail}:`, error);
      return false;
    }
  }
}

export const reportSenderService = new ReportSenderService();
