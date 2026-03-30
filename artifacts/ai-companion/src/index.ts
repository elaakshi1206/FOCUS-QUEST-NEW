import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes.js";
import winston from "winston";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

// ─── Middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────
app.use("/api", chatRoutes);

// Health check (legacy compatibility)
app.get("/health", (_req, res) => {
  res.json({
    status: "✅ FocusQuest AI Companion is online",
    version: "2.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🛡️  FocusQuest AI Companion v2.0 running on http://localhost:${PORT}`);
  logger.info(`📡 Chat endpoint: http://localhost:${PORT}/api/chat`);
  logger.info(`📋 Health check: http://localhost:${PORT}/health`);
});
