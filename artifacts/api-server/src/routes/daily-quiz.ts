import { Router } from "express";
import { getDailyQuiz, submitQuiz, getLeaderboard } from "../controllers/daily-quiz";

const router = Router();

router.get("/daily-quiz", getDailyQuiz);
router.post("/submit-quiz", submitQuiz);
router.get("/leaderboard", getLeaderboard);

export default router;
