import { Router } from "express";
import { createChallenge, getAvailableChallenges, joinChallenge, getChallengeStatus } from "../controllers/challenges";

const router = Router();

router.post("/create", createChallenge);
router.get("/available", getAvailableChallenges);
router.post("/:challengeId/join", joinChallenge);
router.get("/:challengeId/status", getChallengeStatus);

export default router;
