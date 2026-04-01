import { Router } from "express";
import { db } from "@workspace/db";
import { teams, teamMembers, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

// Mock auth extraction
const getUserId = (req: any) => req.body.userId || req.query.userId || 1;

router.post("/create", async (req, res): Promise<any> => {
  try {
    const userId = getUserId(req);
    const { name, avatar, isPublic } = req.body;
    
    const teamIdStr = crypto.randomUUID();

    const [newTeam] = await db.insert(teams).values({
      teamId: teamIdStr,
      name,
      avatar: avatar || "🛡️",
      isPublic: isPublic !== false
    }).returning();

    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: userId,
      role: "owner"
    });

    res.json(newTeam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/join", async (req, res): Promise<any> => {
  try {
    const userId = getUserId(req);
    const { teamId } = req.body; // Actually the UUID `teamId`
    
    const targetTeam = await db.select().from(teams).where(eq(teams.teamId, teamId)).limit(1);
    if (!targetTeam || targetTeam.length === 0) {
       return res.status(404).json({ error: "Team not found" });
    }

    await db.insert(teamMembers).values({
      teamId: targetTeam[0].id,
      userId,
      role: "member"
    });

    res.json({ success: true, team: targetTeam[0] });
  } catch (err) {
     console.error(err);
     res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res): Promise<any> => {
    try {
        const id = parseInt(req.params.id);
        const targetTeamRes = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
        if (targetTeamRes.length === 0) return res.status(404).json({ error: "Not found" });
        
        const targetTeam = targetTeamRes[0];
        
        const membersData = await db.select()
          .from(teamMembers)
          .innerJoin(users, eq(teamMembers.userId, users.id))
          .where(eq(teamMembers.teamId, targetTeam.id));
          
        res.json({
            ...targetTeam,
            members: membersData.map(m => ({
                id: m.users.id,
                name: m.users.name,
                focusScore: m.users.focusScore,
                role: m.team_members.role
            }))
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
