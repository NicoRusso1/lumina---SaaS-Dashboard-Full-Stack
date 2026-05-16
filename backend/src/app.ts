import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "./config/env";
import { notFound, errorHandler } from "./middlewares/errorHandler";

import authRoutes from "./routes/auth.routes";
import boardRoutes from "./routes/board.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting - more relaxed in dev
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.nodeEnv === "production" ? 100 : 500,
  message: { success: false, message: "Too many requests, try again later" },
});
app.use(limiter);

// Routes
app.get("/", (_req, res) => {
  res.json({ success: true, message: "TaskFlow API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
});

export default app;
