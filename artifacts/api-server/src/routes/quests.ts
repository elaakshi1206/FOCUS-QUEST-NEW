import { Router } from "express";
import { db } from "@workspace/db";
import { teamQuests } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res): Promise<any> => {
  try {
    const teamIdParam = req.query.teamId;
    if (!teamIdParam) return res.status(400).json({ error: "teamId required" });
    
    // In a real scenario, this endpoint could generate quests if none exist or are expired
    // But for now, we just fetch active ones
    const activeQuests = await db.select().from(teamQuests).where(eq(teamQuests.teamId, parseInt(teamIdParam as string)));
    
    res.json(activeQuests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
