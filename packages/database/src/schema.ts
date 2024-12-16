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

export const Course = pgTable('course', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),

  title: t.varchar({ length: 256 }).notNull(),
  description: t.text().notNull(),
  tags: t.text().array().notNull(),
  category: t
    .text({
      enum: [
        'STEM',
        'World Languages & Cultures',
        'Fitness & Wellness',
        'Arts & Entertainment',
        'Maker',
        'Personal Skill Building',
      ],
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
  category: z.enum([
    'STEM',
    'World Languages & Cultures',
    'Fitness & Wellness',
    'Arts & Entertainment',
    'Maker',
    'Personal Skill Building',
  ]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

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

export const Session = pgTable('session', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  seasonId: t
    .uuid()
    .notNull()
    .references(() => Season.id, { onDelete: 'cascade' }),
  number: t.integer().notNull(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
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

export const Organization = pgTable('organization', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  active: t.boolean().notNull().default(true),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp()
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
}));

export type TOrganization = InferSelectModel<typeof Organization>;
export type NewOrganization = InferInsertModel<typeof Organization>;
export const CreateOrganizationSchema = createInsertSchema(Organization, {
  name: z.string().min(1).max(256),
  active: z.boolean().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const EditOrganizationSchema = CreateOrganizationSchema;

export const School = pgTable('school', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  active: t.boolean().notNull().default(true),
  organizationId: t
    .uuid()
    .notNull()
    .references(() => Organization.id, { onDelete: 'cascade' }),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp()
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
}));

export type TSchool = InferSelectModel<typeof School>;
export type TSchoolWithOrganization = TSchool & { organization: TOrganization };
export type NewSchool = InferInsertModel<typeof School>;
export const CreateSchoolSchema = createInsertSchema(School, {
  name: z.string().min(1).max(256),
  active: z.boolean().optional(),
  organizationId: z.string().uuid(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const EditSchoolSchema = CreateSchoolSchema;

export const CourseRelations = relations(Course, ({ many }) => ({
  seasons: many(Season),
  files: many(File),
}));

export const FileRelations = relations(File, ({ one }) => ({
  course: one(Course, {
    fields: [File.courseId],
    references: [Course.id],
  }),
}));

export const SeasonRelations = relations(Season, ({ one, many }) => ({
  course: one(Course, {
    fields: [Season.courseId],
    references: [Course.id],
  }),
  sessions: many(Session),
}));

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

export const VideoRelations = relations(Video, ({ one }) => ({
  session: one(Session, {
    fields: [Video.sessionId],
    references: [Session.id],
  }),
}));

export const User = pgTable('user', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  lastName: t.varchar({ length: 256 }),
  phone: t.varchar({ length: 256 }),
  email: t.varchar({ length: 256 }).notNull(),
  imageUrl: t.varchar({ length: 2048 }),
  authProviderUserId: t.varchar({ length: 2048 }),
  role: t
    .text({
      enum: ['educator', 'admin', 'super-admin'],
    })
    .notNull(),
  schoolId: t.uuid().notNull().references(() => School.id, { onDelete: 'cascade' }),
  active: t.boolean().notNull().default(true),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => new Date()),
}));

export type TUser = InferSelectModel<typeof User>;
export type NewUser = InferInsertModel<typeof User>;
export const CreateUserSchema = createInsertSchema(User, {
  name: z.string().min(1).max(256),
  email: z.string().email().min(1).max(256),
  lastName: z.string(),
  phone: z.string(),
  imageUrl: z.string().url(),
  authProviderUserId: z.string().min(1).max(2048),
  active: z.boolean(),
  role: z.enum(['educator', 'admin', 'super-admin']),
  schoolId: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const EditUserSchema = CreateUserSchema;
export const UserRelations = relations(User, ({ one }) => ({
  schools: one(School, {
    fields: [User.schoolId],
    references: [School.id],
  }),
}));

export const OrganizationRelations = relations(Organization, ({ many }) => ({
  schools: many(School),
}));

export const SchoolRelations = relations(School, ({ one, many }) => ({
  organization: one(Organization, {
    fields: [School.organizationId],
    references: [Organization.id],
  }),
  users: many(User),
}));
