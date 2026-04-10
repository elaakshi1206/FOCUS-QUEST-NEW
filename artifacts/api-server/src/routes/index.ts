import { Router, type IRouter } from "express";
import healthRouter from "./health";
import matchmakingRouter from "./matchmaking";
import teamsRouter from "./teams";
import questsRouter from "./quests";
import leaderboardRouter from "./leaderboard";
import challengesRouter from "./challenges";
import dailyQuizRouter from "./daily-quiz";
import usersRouter from "./users";
// ── New Feature Routes ────────────────────────────────────────────────────
import authRouter from "./auth";         // Account creation + OTP + email verify
import scheduleRouter from "./schedule"; // Weekly schedule + daily timetable
import sessionsRouter from "./sessions"; // Session tracking (for reports)
import reportsRouter from "./reports";   // Test trigger + parent report view

const router: IRouter = Router();

router.use(healthRouter);
router.use("/antigravity", matchmakingRouter);
router.use("/teams", teamsRouter);
router.use("/team-quests", questsRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/challenges", challengesRouter);
router.use("/daily", dailyQuizRouter);
router.use("/users", usersRouter);
// ── New routes ────────────────────────────────────────────────────────────
router.use("/auth", authRouter);
router.use("/schedule", scheduleRouter);
router.use("/sessions", sessionsRouter);
router.use("/reports", reportsRouter);

export default router;
