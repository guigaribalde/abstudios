import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { School } from './school';

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

export const OrganizationRelations = relations(Organization, ({ many }) => ({
  schools: many(School),
}));
