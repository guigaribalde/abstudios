import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { File } from "./file";
import { Season } from "./season";

export const Course = pgTable("course", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text().notNull(),
  tags: t.text().array().notNull(),
  category: t
    .text({
      enum: [
        "STEM",
        "World Languages & Cultures",
        "Fitness & Wellness",
        "Arts & Entertainment",
        "Maker",
        "Personal Skill Building",
      ],
    })
    .notNull(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export type TCourse = InferSelectModel<typeof Course>;
export type NewCourse = InferInsertModel<typeof Course>;

export const CreateCourseSchema = createInsertSchema(Course, {
  title: z.string().min(1).max(256),
  description: z.string().min(1),
  tags: z.array(z.string()).nonempty(),
  category: z.enum([
    "STEM",
    "World Languages & Cultures",
    "Fitness & Wellness",
    "Arts & Entertainment",
    "Maker",
    "Personal Skill Building",
  ]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CourseRelations = relations(Course, ({ many }) => ({
  seasons: many(Season),
  files: many(File),
}));
