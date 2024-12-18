import type {
  InferInsertModel,
  InferSelectModel,
} from 'drizzle-orm';
import {
  relations,
  sql,
} from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Course } from './course';
import { Session } from './session';

export const Season = pgTable('season', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  courseId: t
    .uuid()
    .notNull()
    .references(() => Course.id),
  number: t.integer().notNull(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TSeason = InferSelectModel<typeof Season>;
export type NewSeason = InferInsertModel<typeof Season>;

export const CreateSeasonSchema = createInsertSchema(Season, {
  courseId: z.string().uuid(),
  number: z.number().int().positive(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const SeasonRelations = relations(Season, ({ one, many }) => ({
  course: one(Course, {
    fields: [Season.courseId],
    references: [Course.id],
  }),
  sessions: many(Session),
}));
