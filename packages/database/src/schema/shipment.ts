import type {
  InferInsertModel,
  InferSelectModel,
} from 'drizzle-orm';
import type { TSchool } from './school';
import {
  relations,
} from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { School } from './school';

export const Shipment = pgTable('shipment', t => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  schoolId: t
    .uuid()
    .notNull()
    .references(() => School.id, { onDelete: 'cascade' }),
  phone: t.varchar({ length: 256 }).notNull(),
  address: t.varchar({ length: 256 }).notNull(),
  contact: t.varchar({ length: 256 }).notNull(),
  status: t
    .text({ enum: ['pending', 'shipped', 'delivered', 'cancelled'] })
    .notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => new Date()),
}));

export type TShipment = InferSelectModel<typeof Shipment>;
export type ShipmentWithSchool = TShipment & { school: TSchool };
export type NewShipment = InferInsertModel<typeof Shipment>;
export const CreateShipmentSchema = createInsertSchema(Shipment, {
  schoolId: z.string().uuid(),
  phone: z.string().min(1).max(256),
  address: z.string().min(1).max(256),
  contact: z.string().min(1).max(256),
  status: z.enum(['pending', 'shipped', 'delivered', 'cancelled']),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const EditShipmentSchema = CreateShipmentSchema;

export const ShipmentRelations = relations(Shipment, ({ one }) => ({
  school: one(School, {
    fields: [Shipment.schoolId],
    references: [School.id],
  }),
}));
