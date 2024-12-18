// import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
// import { sql } from '@vercel/postgres';
//
// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import * as schema from './schema';
//
// export const db: PostgresJsDatabase<typeof schema> = drizzle({
//   client: sql,
//   schema,
//   casing: 'snake_case',
// });
//
// export { and, eq, ilike, or, sql } from 'drizzle-orm';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sql } from '@vercel/postgres';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleVercel, type VercelPgDatabase } from 'drizzle-orm/vercel-postgres';
import postgres from 'postgres';
import * as schema from './schema';

const isLocal = process.env.NODE_ENV === 'development';
const localUrl = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

type DBType = PostgresJsDatabase<typeof schema> | VercelPgDatabase<typeof schema>;

export const db: DBType = isLocal
  ? drizzlePostgres(postgres(localUrl), {
      schema,
      casing: 'snake_case',
    })
  : drizzleVercel({
      client: sql,
      schema,
      casing: 'snake_case',
    });

export { and, eq, ilike, or, sql } from 'drizzle-orm';
