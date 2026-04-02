import { db } from "../lib/db/src/index";
import { dailyQuiz, challenges, challengeQuestions } from "../lib/db/src/schema";
import { sql } from "drizzle-orm";

async function clearMocks() {
  console.log("Clearing mock questions from DB to ensure new real questions are generated...");
  try {
    await db.delete(dailyQuiz);
    await db.delete(challengeQuestions);
    await db.delete(challenges);
    console.log("Successfully cleared mock questions. The next time the user loads the page, real questions will be generated.");
  } catch (error) {
    console.error("Error clearing mocks:", error);
  }
}

clearMocks();
