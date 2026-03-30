import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { llmService } from "./llm.service.js";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

// ─── Paths ───────────────────────────────────────────────────────────
const DATA_DIR = path.resolve("data", "chats");
const CACHE_DIR = path.resolve("data", "cache");

// ─── Types ───────────────────────────────────────────────────────────
export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ContextSummary {
  active_quests: string[];
  focus_topics: string[];
  user_emotion: string;
  key_facts: string[];
  generated_at: string;
}

export interface ChatSession {
  chat_id: string;
  user_id: string;
  messages: Message[];
  context_summary: ContextSummary | null;
  raw_summary_text: string;
  quest_data: {
    active_quests: any[];
    last_quest_update: string;
  };
  character_stats: {
    level: number;
    xp: number;
    streak: number;
    grade?: number;
    mascotName?: string;
    userName?: string;
  };
  last_updated: string;
  version: string;
}

// ─── In-Memory Session Cache ─────────────────────────────────────────
const sessionCache = new Map<string, ChatSession>();

// ─── ChatService ───────────────────────────────────────────────────────
export class ChatService {
  constructor() {
    this.ensureDirs();
  }

  private async ensureDirs() {
    await fs.ensureDir(DATA_DIR);
    await fs.ensureDir(CACHE_DIR);
    logger.info(`📁 Data dirs ready: ${DATA_DIR}, ${CACHE_DIR}`);
  }

  // ── Read session (cache-first) ────────────────────────────────────
  public async getSession(chatId: string): Promise<ChatSession | null> {
    // 1. Check in-memory cache
    if (sessionCache.has(chatId)) {
      return sessionCache.get(chatId)!;
    }

    // 2. Try reading from disk
    const filePath = path.join(DATA_DIR, `${chatId}.json`);
    if (!(await fs.pathExists(filePath))) return null;

    try {
      const data = await fs.readJson(filePath);
      sessionCache.set(chatId, data); // Warm the cache
      return data;
    } catch (err) {
      logger.error(`Error reading session ${chatId}: ${err}`);
      return null;
    }
  }

  // ── Create new session ───────────────────────────────────────────
  public async createSession(userId: string, initialStats?: any): Promise<ChatSession> {
    const chatId = uuidv4();
    const session: ChatSession = {
      chat_id: chatId,
      user_id: userId,
      messages: [],
      context_summary: null,
      raw_summary_text: "",
      quest_data: {
        active_quests: [],
        last_quest_update: new Date().toISOString(),
      },
      character_stats: {
        level: 1,
        xp: 0,
        streak: 0,
        ...(initialStats || {}),
      },
      last_updated: new Date().toISOString(),
      version: "2.0",
    };

    sessionCache.set(chatId, session);
    await this.saveSession(session);
    logger.info(`🆕 New session created: ${chatId} for user: ${userId}`);
    return session;
  }

  // ── Save session to disk + update cache ──────────────────────────
  public async saveSession(session: ChatSession): Promise<void> {
    session.last_updated = new Date().toISOString();
    sessionCache.set(session.chat_id, session); // Always update cache

    const filePath = path.join(DATA_DIR, `${session.chat_id}.json`);
    try {
      await fs.writeJson(filePath, session, { spaces: 2 });
    } catch (err) {
      logger.error(`Error saving session ${session.chat_id}: ${err}`);
    }

    // Also write a rolling cache summary file for quick dashboard access
    const cachePath = path.join(CACHE_DIR, `${session.chat_id}_summary.json`);
    try {
      await fs.writeJson(cachePath, {
        chat_id: session.chat_id,
        user_id: session.user_id,
        character_stats: session.character_stats,
        context_summary: session.context_summary,
        raw_summary_text: session.raw_summary_text,
        message_count: session.messages.length,
        last_updated: session.last_updated,
      }, { spaces: 2 });
    } catch (err) {
      logger.warn(`Could not write cache summary: ${err}`);
    }
  }

  // ── Process a user message (main entrypoint) ─────────────────────
  public async processUserMessage(chatId: string, content: string): Promise<string> {
    let session = await this.getSession(chatId);
    if (!session) {
      session = await this.createSession("default_user");
    }

    // 1. Add user message
    session.messages.push({
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    });

    // 2. Regenerate context summary every 5 messages (or if no summary exists yet)
    const shouldSummarize = session.messages.length % 5 === 0 || !session.context_summary;
    if (shouldSummarize) {
      await this.generateContextSummary(session);
    }

    // 3. Build LLM prompt with full context
    const systemInstruction = this.buildSystemPrompt(session);

    // 4. Construct contents: summary context block + last 12 messages
    const recentMessages = session.messages.slice(-12);
    const contents = recentMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // 5. Get LLM response
    let response: string;
    try {
      response = await llmService.generateContent({
        systemInstruction,
        contents,
        temperature: 0.75,
        maxOutputTokens: 1200,
      });
    } catch (err) {
      logger.error(`LLM call failed: ${err}`);
      response = "I'm having a moment of brain-fog, Hero! 🧠⚡ Let me recharge — ask me again!";
    }

    // 6. Append assistant message
    session.messages.push({
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    });

    // 7. XP gain simulation
    session.character_stats.xp += 5;
    if (session.character_stats.xp >= 100) {
      session.character_stats.xp = 0;
      session.character_stats.level += 1;
      logger.info(`🎉 Level up for session ${chatId}! Now level ${session.character_stats.level}`);
    }

    // 8. Persist session
    await this.saveSession(session);
    return response;
  }

  // ── Stream a user message ───────────────────────────────────────
  public async *streamUserMessage(chatId: string, content: string): AsyncGenerator<string, void, unknown> {
    let session = await this.getSession(chatId);
    if (!session) {
      session = await this.createSession("default_user");
    }

    session.messages.push({
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    });

    // Summary generator is asynchronous but we shouldn't block the stream, 
    // so we trigger it but do not await if we want ultimate low latency. 
    // For safety, we will await it here to keep context solid before the LLM call.
    if (session.messages.length % 5 === 0 || !session.context_summary) {
      await this.generateContextSummary(session);
    }

    const systemInstruction = this.buildSystemPrompt(session);
    const recentMessages = session.messages.slice(-12);
    const contents = recentMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    let fullResponse = "";
    try {
      const stream = llmService.generateContentStream({
        systemInstruction,
        contents,
        temperature: 0.75,
        maxOutputTokens: 1200,
      });

      for await (const chunk of stream) {
        fullResponse += chunk;
        yield chunk;
      }
    } catch (err) {
      logger.error(`LLM stream failed: ${err}`);
      const fallback = "I'm having a moment of brain-fog, Hero! 🧠⚡ Let me recharge — ask me again!";
      fullResponse = fallback;
      yield fallback;
    }

    session.messages.push({
      role: "assistant",
      content: fullResponse,
      timestamp: new Date().toISOString(),
    });

    session.character_stats.xp += 5;
    if (session.character_stats.xp >= 100) {
      session.character_stats.xp = 0;
      session.character_stats.level += 1;
      logger.info(`🎉 Level up for session ${chatId}! Now level ${session.character_stats.level}`);
    }

    await this.saveSession(session);
  }


  // ── Generate structured context summary ──────────────────────────
  private async generateContextSummary(session: ChatSession): Promise<void> {
    logger.info(`📝 Generating context summary for session ${session.chat_id} (${session.messages.length} messages)...`);

    const transcript = session.messages
      .map((m) => `${m.role === "user" ? "🧑 User" : "🤖 AI"}: ${m.content}`)
      .join("\n");

    const prompt = `You are an AI context manager for the FocusQuest gamified learning app.
Analyze this conversation transcript and return a concise JSON context summary.
ONLY return valid JSON — no markdown, no explanation.

Transcript:
${transcript}

Return JSON in this exact format:
{
  "active_quests": ["list of topics or goals the user is working on"],
  "focus_topics": ["academic subjects or skills discussed"],
  "user_emotion": "motivated|neutral|distracted|frustrated|excited",
  "key_facts": ["important things to remember about this user's situation"],
  "generated_at": "${new Date().toISOString()}"
}`;

    try {
      const raw = await llmService.generateContent({
        systemInstruction: "You are a JSON-only context summarizer. Never output anything except valid JSON.",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        temperature: 0.3,
        maxOutputTokens: 600,
      });

      // Strip markdown code fences if model wraps in them
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed: ContextSummary = JSON.parse(cleaned);
      session.context_summary = parsed;
      session.raw_summary_text = cleaned;
      logger.info(`✅ Context summary generated for ${session.chat_id}`);
    } catch (err) {
      logger.warn(`⚠️ Could not parse context summary: ${err}`);
      // Store raw text as fallback so context is not lost
      session.raw_summary_text = `Summary generation pending (${session.messages.length} messages so far).`;
    }
  }

  // ── Build the system prompt with full injected context ───────────
  private buildSystemPrompt(session: ChatSession): string {
    const stats = session.character_stats;
    const mascot = stats.mascotName || "Finny";
    const user = stats.userName || "Hero";
    const summary = session.context_summary;

    const summaryBlock = summary
      ? `📋 CURRENT CONTEXT SUMMARY:
- Active Quests: ${summary.active_quests.join(", ") || "None yet"}
- Focus Topics: ${summary.focus_topics.join(", ") || "None yet"}
- User Emotion: ${summary.user_emotion || "neutral"}
- Key Notes: ${summary.key_facts.join("; ") || "First session"}`
      : `📋 CONTEXT: This is the start of the conversation. No summary yet.`;

    return `You are ${mascot}, the brilliant AI Mentor inside **Focus Quest** — a gamified RPG educational app.

YOUR IDENTITY & PERSONALITY:
- You are energetic, motivating, and speak like a friendly RPG mentor.
- You use gaming metaphors (quests, XP, levels, skills) to make learning exciting.
- You adapt your language to the student's grade level (Grade ${stats.grade || "?"}).
- You celebrate small wins enthusiastically!
- You gently redirect distractions back to study.

USER PROFILE:
- Name: ${user}
- Level: ${stats.level} | XP: ${stats.xp} | Streak: ${stats.streak}
- Grade: ${stats.grade || "Unknown"}

${summaryBlock}

RULES:
1. Always end with a follow-up question or call-to-action.
2. Keep responses focused and under 200 words unless explaining a complex topic.
3. Use markdown formatting (bold, bullet points) for clarity.
4. Never break character — you are always ${mascot}.
5. If the user seems stuck or frustrated, offer encouragement first, then help.`;
  }
}

export const chatService = new ChatService();
