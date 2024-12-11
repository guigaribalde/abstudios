import { sql } from '@vercel/postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

export const db: PostgresJsDatabase<typeof schema> = drizzle({
  client: sql,
  schema,
  casing: 'snake_case',
});

export { and, eq, ilike, or, sql } from 'drizzle-orm';
