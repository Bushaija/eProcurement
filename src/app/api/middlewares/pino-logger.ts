import { config } from "dotenv";
import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

config({ path: ".env" });

// import env from "@/env";

export function pinoLogger() {
  return logger({
    pino: pino({
      level: process.env.LOG_LEVEL || "info",
    }, process.env.NODE_ENV === "production" ? undefined : pretty()),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}