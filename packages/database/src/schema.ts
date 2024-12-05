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

export const Course = pgTable('course', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text().notNull(),
  tags: t.text().array().notNull(),
  stem: t
    .text({
      enum: ['science', 'technology', 'engineering', 'mathematics'],
    })
    .notNull(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TCourse = InferSelectModel<typeof Course>;
export type NewCourse = InferInsertModel<typeof Course>;

export const CreateCourseSchema = createInsertSchema(Course, {
  title: z.string().min(1).max(256),
  description: z.string().min(1),
  tags: z.array(z.string()).nonempty(),
  stem: z.enum(['science', 'technology', 'engineering', 'mathematics']),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const Season = pgTable('season', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  courseId: t
    .uuid()
    .notNull()
    .references(() => Course.id),
  seasonNumber: t.integer().notNull(),
  title: t.varchar({ length: 256 }).notNull(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TSeason = InferSelectModel<typeof Season>;
export type NewSeason = InferInsertModel<typeof Season>;

export const CreateSeasonSchema = createInsertSchema(Season, {
  courseId: z.string().uuid(),
  seasonNumber: z.number().int().positive(),
  title: z.string().min(1).max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const Episode = pgTable('episode', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  seasonId: t
    .uuid()
    .notNull()
    .references(() => Season.id),
  episodeNumber: t.integer().notNull(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text().notNull(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TEpisode = InferSelectModel<typeof Episode>;
export type NewEpisode = InferInsertModel<typeof Episode>;

export const CreateEpisodeSchema = createInsertSchema(Episode, {
  seasonId: z.string().uuid(),
  episodeNumber: z.number().int().positive(),
  title: z.string().min(1).max(256),
  description: z.string().min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const Video = pgTable('video', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  url: t.varchar({ length: 2048 }).notNull(),

  episodeId: t
    .uuid()
    .notNull()
    .unique()
    .references(() => Episode.id),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TVideo = InferSelectModel<typeof Video>;
export type NewVideo = InferInsertModel<typeof Video>;

export const CourseRelations = relations(Course, ({ many }) => ({
  seasons: many(Season),
}));

export const SeasonRelations = relations(Season, ({ one, many }) => ({
  course: one(Course, {
    fields: [Season.courseId],
    references: [Course.id],
  }),
  episodes: many(Episode),
}));

export const EpisodeRelations = relations(Episode, ({ one }) => ({
  season: one(Season, {
    fields: [Episode.seasonId],
    references: [Season.id],
  }),
  video: one(Video, {
    fields: [Episode.id],
    references: [Video.episodeId],
  }),
}));

export const VideoRelations = relations(Video, ({ one }) => ({
  episode: one(Episode, {
    fields: [Video.episodeId],
    references: [Episode.id],
  }),
}));

// export const Post = pgTable("post", (t) => ({
//   id: t.uuid().notNull().primaryKey().defaultRandom(),
//   title: t.varchar({ length: 256 }).notNull(),
//   content: t.text().notNull(),
//   createdAt: t.timestamp().defaultNow().notNull(),
//   updatedAt: t
//     .timestamp({ mode: "date", withTimezone: true })
//     .$onUpdateFn(() => sql`now()`),
// }));
//
// export const CreatePostSchema = createInsertSchema(Post, {
//   title: z.string().max(256),
//   content: z.string().max(256),
// }).omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });
//
// export const User = pgTable("user", (t) => ({
//   id: t.uuid().notNull().primaryKey().defaultRandom(),
//   name: t.varchar({ length: 255 }),
//   email: t.varchar({ length: 255 }).notNull(),
//   emailVerified: t.timestamp({ mode: "date", withTimezone: true }),
//   image: t.varchar({ length: 255 }),
// }));
//
// export const UserRelations = relations(User, ({ many }) => ({
//   accounts: many(Account),
// }));
//
// export const Account = pgTable(
//   "account",
//   (t) => ({
//     userId: t
//       .uuid()
//       .notNull()
//       .references(() => User.id, { onDelete: "cascade" }),
//     type: t
//       .varchar({ length: 255 })
//       .$type<"email" | "oauth" | "oidc" | "webauthn">()
//       .notNull(),
//     provider: t.varchar({ length: 255 }).notNull(),
//     providerAccountId: t.varchar({ length: 255 }).notNull(),
//     refresh_token: t.varchar({ length: 255 }),
//     access_token: t.text(),
//     expires_at: t.integer(),
//     token_type: t.varchar({ length: 255 }),
//     scope: t.varchar({ length: 255 }),
//     id_token: t.text(),
//     session_state: t.varchar({ length: 255 }),
//   }),
//   (account) => ({
//     compoundKey: primaryKey({
//       columns: [account.provider, account.providerAccountId],
//     }),
//   }),
// );
//
// export const AccountRelations = relations(Account, ({ one }) => ({
//   user: one(User, { fields: [Account.userId], references: [User.id] }),
// }));
//
// export const Session = pgTable("session", (t) => ({
//   sessionToken: t.varchar({ length: 255 }).notNull().primaryKey(),
//   userId: t
//     .uuid()
//     .notNull()
//     .references(() => User.id, { onDelete: "cascade" }),
//   expires: t.timestamp({ mode: "date", withTimezone: true }).notNull(),
// }));
//
// export const SessionRelations = relations(Session, ({ one }) => ({
//   user: one(User, { fields: [Session.userId], references: [User.id] }),
// }));
