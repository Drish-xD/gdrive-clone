import type { LevelWithSilent } from "pino";
import { z } from "zod";

const strToBoolean = z.coerce
	.string()
	.transform((val) => val === "true")
	.default("false");

const configSchema = z
	.object({
		APP_ENV: z.enum(["prod", "test", "dev"]).default("dev"),
		BASE_URL: z.string().default("http://localhost:3000"),
		IsProd: z.boolean().default(false),

		// LOGGING
		LOG_LEVEL: z.custom<LevelWithSilent>().default("info"),

		// JWT
		JWT_SECRET: z.string().default("secret ingredient"),
		COOKIE_SECRET: z.string().default("secret ingredient"),

		// DATABASE
		DATABASE_URL: z.string(),
		DATABASE_LOGGING: strToBoolean,
		SALT_ROUNDS: z.number().default(10),
	})
	.superRefine((data) => {
		data.IsProd = data.APP_ENV === "prod";
		return data;
	});

export const Config = configSchema.parse(process.env);
export type Config = z.infer<typeof configSchema>;
