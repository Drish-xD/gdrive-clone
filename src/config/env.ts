import type { LevelWithSilent } from "pino";
import { z } from "zod";

const strToBoolean = z.coerce
	.string()
	.transform((val) => val === "true")
	.default("false");

const configSchema = z
	.object({
		PORT: z.coerce.number().default(3000),
		APP_ENV: z.enum(["prod", "test", "dev"]).default("dev"),
		BASE_URL: z.string().default("http://localhost:3000"),
		IsProd: z.boolean().default(false),

		// LOGGING
		LOG_LEVEL: z.custom<LevelWithSilent>().default("info"),

		// AUTH & COOKIES
		JWT_SECRET: z.string().default("secret"),
		JWT_REFRESH_SECRET: z.string().default("secret"),
		JWT_EXPIRES_IN: z.coerce.number().default(60),
		JWT_REFRESH_EXPIRES_IN: z.coerce.number().default(10080),
		COOKIE_SECRET: z.string().default("secret"),

		// DATABASE
		DATABASE_URL: z.string(),
		DATABASE_LOGGING: strToBoolean,
		SALT_ROUNDS: z.coerce.number().default(10),
	})
	.superRefine((data) => {
		data.IsProd = data.APP_ENV === "prod";
		return data;
	});

export const CONFIG = configSchema.parse(process.env);
export type CONFIG = z.infer<typeof configSchema>;
