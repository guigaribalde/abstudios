import {
  sql,
  InferSelectModel,
  InferInsertModel,
  relations,
} from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Season } from "./season";
import { Video } from "./video";

export const Session = pgTable("session", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  seasonId: t
    .uuid()
    .notNull()
    .references(() => Season.id, { onDelete: "cascade" }),
  number: t.integer().notNull(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TSession = InferSelectModel<typeof Session>;
export type NewSession = InferInsertModel<typeof Session>;

export const CreateSessionSchema = createInsertSchema(Session, {
  seasonId: z.string().uuid(),
  number: z.number().int().positive(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const SessionRelations = relations(Session, ({ one }) => ({
  season: one(Season, {
    fields: [Session.seasonId],
    references: [Season.id],
  }),
  video: one(Video, {
    fields: [Session.id],
    references: [Video.sessionId],
  }),
}));
