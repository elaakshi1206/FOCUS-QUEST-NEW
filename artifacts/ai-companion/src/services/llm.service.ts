import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

export interface LlmRequest {
  systemInstruction?: string;
  contents: { role: string; parts: { text: string }[] }[];
  temperature?: number;
  maxOutputTokens?: number;
}

// Model priority list — best first, fallback chain
const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
];

export class LlmService {
  private apiKeys: string[] = [];
  private currentKeyIndex: number = 0;
  private providers: Map<string, GoogleGenerativeAI> = new Map();
  private workingModel: string | null = null; // Cache the first model that works

  constructor() {
    this.loadApiKeys();
  }

  private loadApiKeys() {
    // Support comma-separated GEMINI_API_KEYS env var
    const fromEnv = process.env.GEMINI_API_KEYS?.split(",").map((k) => k.trim()).filter(Boolean) || [];

    // Also support individual VITE_GEMINI_API_KEY_N keys (this repo's convention)
    const indexed: string[] = [];
    const single = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (single) indexed.push(single);
    for (let i = 2; i <= 20; i++) {
      const k = process.env[`VITE_GEMINI_API_KEY_${i}`] || process.env[`GEMINI_API_KEY_${i}`];
      if (k) indexed.push(k);
    }

    this.apiKeys = [...new Set([...fromEnv, ...indexed])];

    if (this.apiKeys.length === 0) {
      logger.error("❌ No Gemini API keys found. Set GEMINI_API_KEYS or VITE_GEMINI_API_KEY in .env");
    } else {
      logger.info(`✅ Loaded ${this.apiKeys.length} Gemini API key(s).`);
    }
  }

  private getProvider(apiKey: string): GoogleGenerativeAI {
    if (!this.providers.has(apiKey)) {
      this.providers.set(apiKey, new GoogleGenerativeAI(apiKey));
    }
    return this.providers.get(apiKey)!;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private rotateKey() {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
  }

  public async generateContent(request: LlmRequest): Promise<string> {
    if (this.apiKeys.length === 0) {
      throw new Error("No API keys configured.");
    }

    // Use the cached working model first to save time
    const modelsToTry = this.workingModel
      ? [this.workingModel, ...MODEL_PRIORITY.filter((m) => m !== this.workingModel)]
      : MODEL_PRIORITY;

    for (const modelName of modelsToTry) {
      // Try all keys for this model
      for (let keyAttempt = 0; keyAttempt < this.apiKeys.length; keyAttempt++) {
        const apiKey = this.apiKeys[this.currentKeyIndex];
        const genAI = this.getProvider(apiKey);

        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: request.systemInstruction,
            generationConfig: {
              temperature: request.temperature ?? 0.75,
              maxOutputTokens: request.maxOutputTokens ?? 1200,
              topP: 0.95,
              topK: 40,
            },
          });

          logger.info(`🧠 Calling ${modelName} with key[${this.currentKeyIndex}]...`);

          const result = await model.generateContent({ contents: request.contents as any });
          const text = result.response.text();

          if (text) {
            this.workingModel = modelName; // Cache successful model
            logger.info(`✅ Response from ${modelName} (${text.length} chars)`);
            return text;
          }

        } catch (err: any) {
          const status = err?.status ?? err?.code;
          const msg = err?.message ?? "Unknown error";

          if (status === 429) {
            logger.warn(`⚠️ Rate limited on key[${this.currentKeyIndex}] with ${modelName}. Rotating key...`);
            this.rotateKey();
            await this.sleep(300);
          } else if (status === 404 || msg.includes("not found") || msg.includes("deprecated")) {
            logger.warn(`⚠️ Model ${modelName} unavailable. Trying next model...`);
            break; // Move to next model
          } else if (status >= 500) {
            logger.error(`🔥 Server error (${status}) with ${modelName}. Backoff retry...`);
            this.rotateKey();
            await this.sleep(1000);
          } else {
            logger.error(`❌ Unexpected error with ${modelName}: ${msg}`);
            this.rotateKey();
          }
        }
      }
    }

    throw new Error("❌ All models and API keys exhausted. Check your API quotas.");
  }

  public async *generateContentStream(request: LlmRequest): AsyncGenerator<string, void, unknown> {
    if (this.apiKeys.length === 0) {
      throw new Error("No API keys configured.");
    }

    const modelsToTry = this.workingModel
      ? [this.workingModel, ...MODEL_PRIORITY.filter((m) => m !== this.workingModel)]
      : MODEL_PRIORITY;

    for (const modelName of modelsToTry) {
      for (let keyAttempt = 0; keyAttempt < this.apiKeys.length; keyAttempt++) {
        const apiKey = this.apiKeys[this.currentKeyIndex];
        const genAI = this.getProvider(apiKey);

        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: request.systemInstruction,
            generationConfig: {
              temperature: request.temperature ?? 0.75,
              maxOutputTokens: request.maxOutputTokens ?? 1200,
              topP: 0.95,
              topK: 40,
            },
          });

          logger.info(`🌊 Streaming ${modelName} with key[${this.currentKeyIndex}]...`);
          const result = await model.generateContentStream({ contents: request.contents as any });
          
          let fullText = "";
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              fullText += chunkText;
              yield chunkText;
            }
          }

          this.workingModel = modelName;
          logger.info(`✅ Stream finished (${fullText.length} chars)`);
          return;

        } catch (err: any) {
          const status = err?.status ?? err?.code;
          const msg = err?.message ?? "Unknown error";

          if (status === 429) {
            logger.warn(`⚠️ Rate limited pulling stream key[${this.currentKeyIndex}].`);
            this.rotateKey();
            await this.sleep(300);
          } else if (status === 404 || msg.includes("not found")) {
            break; 
          } else {
            logger.error(`❌ Stream chunk error with ${modelName}: ${msg}`);
            this.rotateKey();
            await this.sleep(500);
          }
        }
      }
    }
    throw new Error("❌ Stream failed. All models exhausted.");
  }
}

export const llmService = new LlmService();
