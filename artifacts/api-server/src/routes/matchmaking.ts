import { Router } from "express";
import { db } from "@workspace/db";
import { users } from "@workspace/db";
import { ne } from "drizzle-orm";

const router = Router();

// A simple mock for req.user to be used during this prototype
// In reality, this would be set by a JWT authentication middleware
const getUserId = (req: any) => req.body.userId ? parseInt(req.body.userId) : 1; 

router.post("/match-users", async (req, res): Promise<any> => {
  try {
    const userId = getUserId(req);
    const { maxTeamSize = 4, preferredTopics = [] } = req.body;

    const currentUserReq = await db.select().from(users).where(ne(users.id, -1)); // hack to get types or we can just fetch all
    const currentUser = currentUserReq.find(u => u.id === userId);
    
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // AI Matchmaking Algorithm
    // 1. Filter out the current user
    const candidates = currentUserReq.filter(u => u.id !== userId);

    const scoredMatches = candidates.map(candidate => {
      let score = 50; // base score
      let reasons = [];

      // Difficulty level matching (want similar or complimentary levels)
      if (candidate.difficultyLevel === currentUser.difficultyLevel) {
        score += 20;
        reasons.push("Similar skill level");
      }

      // Topic overlap
      const sharedTopics = candidate.learningTopics.filter(t => preferredTopics.includes(t) || currentUser.learningTopics.includes(t));
      if (sharedTopics.length > 0) {
        score += (sharedTopics.length * 10);
        reasons.push(`Shared interests: ${sharedTopics.join(", ")}`);
      }

      // Similar Focus Score
      const focusDiff = Math.abs(candidate.focusScore - currentUser.focusScore);
      if (focusDiff < 20) {
        score += 15;
        reasons.push("Close focus alignment");
      }

      // Improvement rate (pair improving players together for momentum)
      if (candidate.improvementRate > 0 && currentUser.improvementRate > 0) {
        score += 10;
        reasons.push("Both on positive streaks");
      }

      return {
        user: candidate,
        matchScore: Math.min(score, 100),
        reason: reasons.length > 0 ? reasons.join(" | ") : "Balanced Match"
      };
    });

    // Rank by score descending
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    // Return the top N matches
    const topMatches = scoredMatches.slice(0, maxTeamSize - 1);
    
    res.json({ matches: topMatches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
