import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sql } from '@vercel/postgres';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

export const db: PostgresJsDatabase<typeof schema> = drizzle({
  client: sql,
  schema,
  casing: 'snake_case',
});
