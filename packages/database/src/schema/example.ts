import type {
  InferInsertModel,
  InferSelectModel,
} from 'drizzle-orm';
import {
  sql,
} from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const Example = pgTable('example', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  example: t.varchar({ length: 256 }).notNull(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TExample = InferSelectModel<typeof Example>;
export type NewExample = InferInsertModel<typeof Example>;
export const CreateExampleSchema = createInsertSchema(Example, {
  example: z.string().min(1).max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
