import { Router, type IRouter } from "express";
import healthRouter from "./health";
import matchmakingRouter from "./matchmaking";
import teamsRouter from "./teams";
import questsRouter from "./quests";
import leaderboardRouter from "./leaderboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/antigravity", matchmakingRouter); // Mounting under /antigravity or just root
router.use("/teams", teamsRouter);
router.use("/team-quests", questsRouter);
router.use("/leaderboard", leaderboardRouter);

export default router;
