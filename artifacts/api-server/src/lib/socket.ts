import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { logger } from "./logger";
import { db } from "@workspace/db";
import { challenges, challengeSubmissions, challengeQuestions, teams } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

let io: SocketIOServer;

export function initSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Adjust in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket: Socket) => {
    logger.info({ socketId: socket.id }, "Client connected");

    socket.on("joinChallengeRoom", (challengeId: string, teamId: string) => {
      const room = `challenge_${challengeId}`;
      socket.join(room);
      logger.info({ socketId: socket.id, room, teamId }, "Socket joined room");
      // Could broadcast to the room that a team is ready.
      socket.to(room).emit("teamJoined", { teamId });
    });

    socket.on("submitRealtimeAnswer", async (data: { challengeId: string; teamId: string; questionId: string; answer: string; timeTaken: number }) => {
      try {
        const { challengeId, teamId, questionId, answer, timeTaken } = data;
        
        // Find question
        const [question] = await db.select().from(challengeQuestions).where(eq(challengeQuestions.id, Number(questionId)));
        
        if (!question) {
          return socket.emit("error", { message: "Question not found" });
        }

        const isCorrect = question.correctAnswer === answer;
        const points = isCorrect ? Math.max(10, 100 - Math.floor(timeTaken / 1000) * 5) : 0; // Dynamic scoring based on speed

        // Save submission
        const [submission] = await db.insert(challengeSubmissions).values({
          challengeId: Number(challengeId),
          teamId: Number(teamId),
          questionId: Number(questionId),
          answer,
          timeTaken,
          points
        }).returning();

        // Broadcast points update to the room
        io.to(`challenge_${challengeId}`).emit("answerSubmitted", {
          teamId: Number(teamId),
          questionId: Number(questionId),
          isCorrect,
          pointsEarned: points,
          totalTime: timeTaken
        });

      } catch (error) {
        logger.error({ err: error }, "Error handling realtime answer");
      }
    });

    socket.on("disconnect", () => {
      logger.info({ socketId: socket.id }, "Client disconnected");
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
