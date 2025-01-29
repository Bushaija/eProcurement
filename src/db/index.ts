import { config } from 'dotenv';
// import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./schema";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

config({ path: '.env' });

// const db = drizzle(process.env.DATABASE_URL!, { schema });

// const sql = 


// ====== PRODUCTION ======
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema});

export { db };
// ========= END ============

