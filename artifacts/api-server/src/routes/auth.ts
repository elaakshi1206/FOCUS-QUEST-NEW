/**
 * routes/auth.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Authentication & account creation routes.
 *
 * POST /api/auth/signup          — Step 1+2: collect student + parent info, send OTP + email
 * POST /api/auth/verify-otp      — Step 3a: verify 6-digit SMS OTP
 * POST /api/auth/resend-otp      — Step 3a retry: resend OTP
 * GET  /api/auth/verify-email    — Step 3b: email link callback (query ?token=)
 * POST /api/auth/login           — Simple name-only login (backwards compat)
 * GET  /api/auth/parent/:userId  — Get parent info for a student
 *
 * Connected to:
 *   • lib/mailer.ts  — sends email verification link
 *   • lib/twilio.ts  — sends SMS OTP
 *   • DB tables: users, parents
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Router } from "express";
import { db, users, parents } from "@workspace/db";
import { eq } from "drizzle-orm";
import { generateOTP, sendOTP } from "../lib/twilio.js";
import { sendVerificationEmail, verifyEmailToken } from "../lib/mailer.js";

const router = Router();

// ─── POST /signup ─────────────────────────────────────────────────────────
// Creates parent record + student record, sends OTP + verification email.

router.post("/signup", async (req, res): Promise<any> => {
  try {
    const {
      // Student fields
      studentName,    // hero name (used as username)
      fullName,       // real full name
      age,
      grade,
      avatar,
      // Parent fields
      parentName,
      parentPhone,
      parentEmail,
    } = req.body;

    if (!studentName || !fullName || !parentName || !parentPhone || !parentEmail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate phone format (+91XXXXXXXXXX)
    const phoneClean = parentPhone.replace(/\s+/g, "");
    if (!/^\+\d{10,15}$/.test(phoneClean)) {
      return res.status(400).json({ error: "Invalid phone number format. Use +91XXXXXXXXXX" });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Check if parent phone/email already exists
    const existingParent = await db.select().from(parents).where(eq(parents.phone, phoneClean));
    if (existingParent.length > 0) {
      return res.status(409).json({ error: "A parent account with this phone number already exists" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Create parent record (unverified)
    const [parent] = await db.insert(parents).values({
      fullName: parentName,
      phone: phoneClean,
      email: parentEmail,
      phoneVerified: false,
      emailVerified: false,
      otpCode: otp,
      otpExpiresAt: otpExpiry,
    }).returning();

    // Create student (user) record
    const emailForUser = `${studentName.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now()}@focusquest.app`;
    const gradeNum = parseInt(grade) || 3;
    const theme = gradeNum <= 4 ? "ocean" : gradeNum <= 7 ? "space" : "future";

    const [user] = await db.insert(users).values({
      name: studentName,
      fullName,
      email: emailForUser,
      age: parseInt(age) || 10,
      grade: gradeNum,
      theme,
      avatarUrl: avatar || "🦅",
      parentId: parent.id,
      focusScore: 0,
      totalXp: 0,
      difficultyLevel: "Beginner",
      learningTopics: [],
      currentStreak: 0,
      improvementRate: 0,
    }).returning();

    // Send OTP via SMS
    await sendOTP(phoneClean, otp);

    // Send email verification link
    await sendVerificationEmail(parentEmail, parent.id, parentName);

    return res.json({
      success: true,
      userId: user.id,
      parentId: parent.id,
      message: "Account created! OTP sent to phone. Verification email sent to parent email.",
      // Return student info for frontend session
      student: {
        id: user.id,
        name: user.name,
        fullName: user.fullName,
        grade: user.grade,
        theme: user.theme,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email or phone already registered" });
    }
    return res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// ─── POST /verify-otp ─────────────────────────────────────────────────────
router.post("/verify-otp", async (req, res): Promise<any> => {
  try {
    const { parentId, otp } = req.body;

    if (!parentId || !otp) {
      return res.status(400).json({ error: "parentId and otp are required" });
    }

    const [parent] = await db.select().from(parents).where(eq(parents.id, parseInt(parentId)));
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    if (parent.phoneVerified) {
      return res.json({ success: true, message: "Phone already verified" });
    }

    if (!parent.otpCode || !parent.otpExpiresAt) {
      return res.status(400).json({ error: "No OTP found. Please request a new one." });
    }

    if (new Date() > new Date(parent.otpExpiresAt)) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (parent.otpCode !== otp.toString()) {
      return res.status(400).json({ error: "Incorrect OTP. Please try again." });
    }

    // Mark phone verified, clear OTP
    await db.update(parents).set({
      phoneVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    }).where(eq(parents.id, parent.id));

    return res.json({ success: true, message: "Phone verified successfully! ✅" });
  } catch (err) {
    console.error("OTP verify error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
});

// ─── POST /resend-otp ─────────────────────────────────────────────────────
router.post("/resend-otp", async (req, res): Promise<any> => {
  try {
    const { parentId } = req.body;
    if (!parentId) return res.status(400).json({ error: "parentId is required" });

    const [parent] = await db.select().from(parents).where(eq(parents.id, parseInt(parentId)));
    if (!parent) return res.status(404).json({ error: "Parent not found" });
    if (parent.phoneVerified) return res.json({ success: true, message: "Phone already verified" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.update(parents).set({ otpCode: otp, otpExpiresAt: otpExpiry }).where(eq(parents.id, parent.id));
    await sendOTP(parent.phone, otp);

    return res.json({ success: true, message: "New OTP sent!" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ error: "Failed to resend OTP" });
  }
});

// ─── GET /verify-email ────────────────────────────────────────────────────
router.get("/verify-email", async (req, res): Promise<any> => {
  try {
    const { token } = req.query as { token?: string };
    if (!token) return res.status(400).json({ error: "Token is required" });

    const payload = verifyEmailToken(token);
    if (!payload) {
      return res.status(400).json({ error: "Invalid or expired verification link" });
    }

    const [parent] = await db.select().from(parents).where(eq(parents.id, payload.parentId));
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    await db.update(parents).set({ emailVerified: true }).where(eq(parents.id, parent.id));

    // Redirect to success page in the frontend
    return res.redirect(`${process.env.BASE_URL || "http://localhost:5173"}/email-verified?name=${encodeURIComponent(parent.fullName)}`);
  } catch (err) {
    console.error("Email verify error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
});

// ─── POST /login (backwards compat) ──────────────────────────────────────
router.post("/login", async (req, res): Promise<any> => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });

    const existing = await db.select().from(users).where(eq(users.name, name));
    if (existing.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ success: true, user: existing[0] });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// ─── GET /parent/:userId ──────────────────────────────────────────────────
router.get("/parent/:userId", async (req, res): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || !user.parentId) return res.status(404).json({ error: "No parent linked" });

    const [parent] = await db.select().from(parents).where(eq(parents.id, user.parentId));
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    // Return safe subset (no OTP/token)
    return res.json({
      id: parent.id,
      fullName: parent.fullName,
      phone: parent.phone,
      email: parent.email,
      phoneVerified: parent.phoneVerified,
      emailVerified: parent.emailVerified,
    });
  } catch (err) {
    console.error("Get parent error:", err);
    return res.status(500).json({ error: "Failed to fetch parent info" });
  }
});

export default router;
