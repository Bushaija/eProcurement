// import env from "@/env";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

console.log(process.env.DATA)

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: './migrations',
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
});
