import { Router } from "express";
import { db, users } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/sync", async (req, res): Promise<any> => {
  try {
    const profile = req.body;
    if (!profile || !profile.userName) {
      return res.status(400).json({ error: "userName is required" });
    }

    const { userName, xp, streak, grade, theme, selectedSubjects, focusHistory } = profile;

    // Compute simple focusScore out of 100 based on recent focusHistory
    let computedFocusScore = 0;
    if (focusHistory && focusHistory.length > 0) {
      const total = focusHistory.reduce((acc: number, f: any) => acc + (f.score || 0), 0);
      // Let's cap at 100 just in case
      computedFocusScore = Math.min(100, Math.round(total / focusHistory.length));
    }

    // Determine improvement rate simple mock (trend in last 5 sessions)
    let improvementRate = 0;
    if (focusHistory && focusHistory.length > 1) {
       const recent = focusHistory.slice(-5);
       if (recent[recent.length - 1].score > recent[0].score) {
          improvementRate = 5;
       }
    }

    const existingUsers = await db.select().from(users).where(eq(users.name, userName));

    if (existingUsers.length > 0) {
      // Update
      const [updatedUser] = await db.update(users).set({
        totalXp: xp || existingUsers[0].totalXp,
        currentStreak: streak !== undefined ? streak : existingUsers[0].currentStreak,
        grade: grade || existingUsers[0].grade,
        theme: theme || existingUsers[0].theme,
        focusScore: computedFocusScore || existingUsers[0].focusScore,
        improvementRate: improvementRate || existingUsers[0].improvementRate,
        learningTopics: selectedSubjects || existingUsers[0].learningTopics,
      }).where(eq(users.id, existingUsers[0].id)).returning();
      
      return res.json({ success: true, user: updatedUser });
    } else {
      // Insert
      const email = `${userName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}@focusquest.app`;
      const [newUser] = await db.insert(users).values({
        name: userName,
        email: email,
        totalXp: xp || 0,
        currentStreak: streak || 0,
        grade: grade || 3,
        theme: theme || "ocean",
        focusScore: computedFocusScore || 0,
        improvementRate: improvementRate || 0,
        learningTopics: selectedSubjects || [],
        difficultyLevel: "Beginner"
      }).returning();
      
      return res.json({ success: true, user: newUser });
    }
  } catch (err) {
    console.error("Error syncing user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:name", async (req, res): Promise<any> => {
  try {
    const { name } = req.params;
    const existingUsers = await db.select().from(users).where(eq(users.name, name));
    if (existingUsers.length > 0) {
      return res.json(existingUsers[0]);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
