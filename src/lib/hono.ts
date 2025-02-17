import { config } from "dotenv"
import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/app";

config({ path: ".env" });

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
