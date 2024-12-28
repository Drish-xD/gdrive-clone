import { Hono } from "hono";

const app = new Hono();

app.post("/register", async (ctx) => {
	return ctx.text("register");
});

app.post("/login", async (ctx) => {
	return ctx.text("login");
});

app.post("/refresh-token", async (ctx) => {
	return ctx.text("refresh-token");
});

app.post("/logout", async (ctx) => {
	return ctx.text("logout");
});

app.post("/forgot-password", async (ctx) => {
	return ctx.text("forgot-password");
});

app.post("/reset-password", async (ctx) => {
	return ctx.text("reset-password");
});

export default app;
