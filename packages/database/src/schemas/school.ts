import { InferSelectModel, InferInsertModel, relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Organization, TOrganization } from "./organization";
import { User } from "./user";

export const School = pgTable("school", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  active: t.boolean().notNull().default(true),
  organizationId: t
    .uuid()
    .notNull()
    .references(() => Organization.id, { onDelete: "cascade" }),

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

export const SchoolRelations = relations(School, ({ one, many }) => ({
  organization: one(Organization, {
    fields: [School.organizationId],
    references: [Organization.id],
  }),
  users: many(User),
}));
