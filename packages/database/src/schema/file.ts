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

export const File = pgTable('file', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  url: t.varchar({ length: 2048 }).notNull(),
  type: t.text({ enum: ['pdf'] }).notNull().default('pdf'),
  courseId: t
    .uuid()
    .notNull()
    .references(() => Course.id, { onDelete: 'cascade' }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TFile = InferSelectModel<typeof File>;
export type NewFile = InferInsertModel<typeof File>;

export const CreateFileSchema = createInsertSchema(File, {
  name: z.string().min(1).max(256),
  url: z.string().url(),
  type: z.enum(['pdf']),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const FileRelations = relations(File, ({ one }) => ({
  course: one(Course, {
    fields: [File.courseId],
    references: [Course.id],
  }),
}));
