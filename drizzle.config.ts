import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "NULL",
	},
	verbose: true,
	casing: "snake_case",
});
