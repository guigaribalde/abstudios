import { InferSelectModel, InferInsertModel, relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { School } from "./school";

export const User = pgTable("user", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  lastName: t.varchar({ length: 256 }),
  phone: t.varchar({ length: 256 }),
  email: t.varchar({ length: 256 }).notNull(),
  imageUrl: t.varchar({ length: 2048 }),
  authProviderUserId: t.varchar({ length: 2048 }),
  role: t
    .text({
      enum: ["educator", "admin", "super-admin"],
    })
    .notNull(),
  schoolId: t
    .uuid()
    .notNull()
    .references(() => School.id, { onDelete: "cascade" }),
  active: t.boolean().notNull().default(true),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
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
  role: z.enum(["educator", "admin", "super-admin"]),
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
