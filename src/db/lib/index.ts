import { z } from "@hono/zod-openapi";
import { timestamp } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";

export const defaultTimestamps = {
	updatedAt: timestamp().defaultNow().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	deletedAt: timestamp(),
};

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z });

export type { infer as inferType } from "zod";
export { createInsertSchema, createSelectSchema, createUpdateSchema };
