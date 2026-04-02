import { Router, type IRouter } from "express";
import healthRouter from "./health";
import matchmakingRouter from "./matchmaking";
import teamsRouter from "./teams";
import questsRouter from "./quests";
import leaderboardRouter from "./leaderboard";
import challengesRouter from "./challenges";
import dailyQuizRouter from "./daily-quiz";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/antigravity", matchmakingRouter); // Mounting under /antigravity or just root
router.use("/teams", teamsRouter);
router.use("/team-quests", questsRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/challenges", challengesRouter);
router.use("/daily", dailyQuizRouter);
router.use("/users", usersRouter);

export default router;
