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
import { Session } from './session';

export const Video = pgTable('video', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  uploadId: t.text().notNull(),
  playbackId: t.text(),
  url: t.varchar({ length: 2048 }).notNull(),
  title: t.varchar({ length: 256 }).notNull(),
  subtitle: t.text().notNull(),
  sessionId: t
    .uuid()
    .notNull()
    .unique()
    .references(() => Session.id),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TVideo = InferSelectModel<typeof Video>;
export type NewVideo = InferInsertModel<typeof Video>;

export const CreateVideoSchema = createInsertSchema(Video, {
  url: z.string().url(),
  title: z.string().min(1).max(256),
  subtitle: z.string().min(1),
  uploadId: z.string().min(1),
  playbackId: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const VideoRelations = relations(Video, ({ one }) => ({
  session: one(Session, {
    fields: [Video.sessionId],
    references: [Session.id],
  }),
}));
