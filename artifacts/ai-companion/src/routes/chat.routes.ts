import { Router, Request, Response } from "express";
import { chatService } from "../services/chat.service.js";
import { z } from "zod";

const router = Router();

// ─── Request Schema ───────────────────────────────────────────────────
const ChatRequestSchema = z.object({
  chat_id: z.string().optional(),
  user_id: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty"),
  user_stats: z
    .object({
      level: z.number().optional(),
      xp: z.number().optional(),
      streak: z.number().optional(),
      userName: z.string().optional(),
      grade: z.number().optional(),
      mascotName: z.string().optional(),
    })
    .optional(),
});

// ─── POST /api/chat — Send a message ─────────────────────────────────
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const body = ChatRequestSchema.parse(req.body);
    let chatId = body.chat_id;

    // Create a new session if no chat_id is provided
    if (!chatId) {
      const newSession = await chatService.createSession(
        body.user_id || "anonymous",
        body.user_stats
      );
      chatId = newSession.chat_id;
    }

    // Process the message — this blocks until the LLM responds
    const reply = await chatService.processUserMessage(chatId, body.message);
    const session = await chatService.getSession(chatId);

    res.json({
      chat_id: chatId,
      reply,
      character_stats: session?.character_stats,
      context_summary: session?.context_summary,
      raw_summary: session?.raw_summary_text,
      message_count: session?.messages.length,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request", details: err.errors });
    }
    console.error("Chat route error:", err);
    res.status(500).json({ error: "AI Companion encountered an error.", details: err.message });
  }
});

// ─── GET /api/chat/session/:id — Load a session ───────────────────────
router.get("/chat/session/:id", async (req: Request, res: Response) => {
  const session = await chatService.getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: "Session not found", chat_id: req.params.id });
  }
  res.json(session);
});

// ─── POST /api/chat/new — Explicitly create a new session ────────────
router.post("/chat/new", async (req: Request, res: Response) => {
  try {
    const { user_id, user_stats } = req.body;
    const session = await chatService.createSession(user_id || "anonymous", user_stats);
    res.status(201).json({ chat_id: session.chat_id, character_stats: session.character_stats });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create session", details: err.message });
  }
});

// ─── GET /api/status — Quick health/status check ─────────────────────
router.get("/status", (_req: Request, res: Response) => {
  res.json({
    status: "online",
    service: "FocusQuest AI Companion",
    timestamp: new Date().toISOString(),
    version: "2.0",
  });
});
// ─── POST /api/chat/stream — Stream a message ──────────────────────────
router.post("/chat/stream", async (req: Request, res: Response) => {
  try {
    const body = ChatRequestSchema.parse(req.body);
    let chatId = body.chat_id;

    if (!chatId) {
      const newSession = await chatService.createSession(
        body.user_id || "anonymous",
        body.user_stats
      );
      chatId = newSession.chat_id;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send initial metadata chunk
    res.write(`data: ${JSON.stringify({ type: "meta", chat_id: chatId })}\n\n`);

    const stream = chatService.streamUserMessage(chatId, body.message);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ type: "chunk", text: chunk })}\n\n`);
    }

    // After finish, send the updated stats/summary
    const updatedSession = await chatService.getSession(chatId);
    res.write(`data: ${JSON.stringify({ 
      type: "done", 
      character_stats: updatedSession?.character_stats,
      context_summary: updatedSession?.context_summary 
    })}\n\n`);
    res.end();

  } catch (err: any) {
    if (err instanceof z.ZodError) {
       res.status(400).json({ error: "Invalid request", details: err.errors });
       return;
    }
    console.error("Chat Stream Error:", err);
    res.status(500).json({ error: "Stream failed.", details: err.message });
  }
});

export default router;
