import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { redisClient, connectRedis } from "./config/redis.js";
import dotenv from "dotenv";
import { connectToDb } from './config/database.js';
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import todoRoutes from "./routes/todos.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT =  process.env.PORT || 3000;

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost'
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb'}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100
});

app.use('/api/', limiter);

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

app.get('/health', (req, res) => {
  const mongoOk = mongoose.connection.readyState === 1;
  const redisOk = redisClient?.isOpen;

  const status = mongoOk && redisOk ? 'healthy' : 'unhealthy';

  res.status(status === 'healthy' ? 200 : 503).json({
    status,
    mongo: mongoOk,
    redis: redisOk,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    containerId: process.env.HOSTNAME || "local",
    timestamp: new Date().toISOString()
  })
});

app.use("/api", todoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function shutdown(signal) {
  console.log(`${signal} received. shutting down...`);

  try {
    await mongoose.connection.close();
    if (redisClient.isOpen) await redisClient.quit();

    console.log("Connections closed");
    process.exit(0);
  } catch (err) {
    console.error("Shutdown error:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

async function startServer() {
  try {
    await connectToDb();
    await connectRedis();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`Env: ${process.env.NODE_ENV || "development"}`);
    });

  } catch(err) {
    console.log("Failed to start server: ", err)
    process.exit(1);
  }
}

startServer();