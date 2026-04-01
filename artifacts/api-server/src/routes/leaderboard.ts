import { Router } from "express";
import { db } from "@workspace/db";
import { users, teams } from "@workspace/db";

const router = Router();

router.get("/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    
    // Weighted scoring: Total XP (40%), Focus (30%), Streak (20%), Improvement (10%)
    const rankedUsers = allUsers.map(u => {
        const score = (u.totalXp * 0.4) + (u.focusScore * 0.3) + (u.currentStreak * 10 * 0.2) + (u.improvementRate * 10 * 0.1);
        return { ...u, leaderboardScore: score };
    }).sort((a, b) => b.leaderboardScore - a.leaderboardScore).slice(0, 50);
    
    res.json(rankedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/teams", async (req, res) => {
    try {
        const allTeams = await db.select().from(teams);
        
        // Teams score based on XP and streak
        const rankedTeams = allTeams.map(t => {
            const score = (t.totalXp * 0.7) + (t.focusStreak * 50 * 0.3);
            return { ...t, leaderboardScore: score };
        }).sort((a, b) => b.leaderboardScore - a.leaderboardScore).slice(0, 50);
        
        res.json(rankedTeams);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
});

export default router;
