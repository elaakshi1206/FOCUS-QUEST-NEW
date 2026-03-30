import { Request, Response } from "express";
import { ContextManager, Message } from "../services/context.manager.js";
import { LLMService } from "../services/llm.service.js";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

const contextManager = new ContextManager();
const llmService = new LLMService();

export const handleChatRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, message, chat_id } = req.body;

    // Validate payload
    if (!user_id || !message) {
      res.status(400).json({ error: "Missing required fields: 'user_id' and 'message'." });
      return;
    }

    // Load or create Context Session
    logger.info(`Processing chat request from user ${user_id}`);
    const session = await contextManager.getSession(user_id, chat_id);

    // Prepare User Message
    const userMessage: Message = { role: "user", text: message };

    // Ask LLM to generate reply based on history
    const aiResponseText = await llmService.generateReply(session.history, userMessage.text);

    // Prepare Assistant Message
    const assistantMessage: Message = { role: "assistant", text: aiResponseText };

    // Update Context via ContextManager using the two new messages
    await contextManager.updateSession(session, [userMessage, assistantMessage]);

    // Return the response pointing to updated contextual state
    res.status(200).json({
      chat_id: session.chatId,
      assistant_reply: aiResponseText,
    });

  } catch (err: any) {
    logger.error("Error handling chat request", err);
    res.status(500).json({
      error: "An error occurred while generating a response.",
    });
  }
};
