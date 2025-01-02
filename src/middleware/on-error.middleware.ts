import { HTTP_STATUSES } from "@/constants";
import type { HTTP_STATUS, TError, TValidationError } from "@/helpers/types";
import type { Hook } from "@hono/zod-openapi";
import type { Context, Env, ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

const HTTP_STATUSES_MAP = Object.entries(HTTP_STATUSES).reduce<Record<number, HTTP_STATUS>>((acc, [_, value]) => {
	acc[value.CODE] = value;
	return acc;
}, {});

const getStatusFromCode = (status: StatusCode) => HTTP_STATUSES_MAP?.[status];

export const onError: ErrorHandler = (error, ctx) => {
	const status = getStatusFromCode(ctx.res.status as StatusCode) ?? HTTP_STATUSES.INTERNAL_SERVER_ERROR;

	if (error instanceof ZodError) {
		return ctx.json<TValidationError>(
			{
				code: status.KEY,
				message: error.name,
				details: {
					errors: error.flatten().fieldErrors,
				},
				stack: error.stack,
			},
			{ status: status.CODE },
		);
	}

	if (error instanceof HTTPException) {
		return ctx.json<TError>(
			{
				code: status?.KEY,
				message: error.message,
				details: error?.cause ?? {},
				stack: error.stack,
			},
			{ status: status.CODE },
		);
	}

	return ctx.json<TError>(
		{
			code: status.KEY,
			message: error?.message ?? "An unexpected error occurred on the server. Please try again later or contact support if the issue persists.",
			details: error?.cause,
			stack: error?.stack,
		},
		{ status: status.CODE },
	);
};

// biome-ignore lint/suspicious/noExplicitAny: This is a generic hook that can be used in any context.
export const handleZodError = <E extends Env>(result: Parameters<Hook<any, Env, any, any>>["0"], ctx: Context) => {
	if (!result.success) {
		const error = result?.error;
		return ctx.json<TValidationError>(
			{
				code: HTTP_STATUSES.UNPROCESSABLE_ENTITY.KEY,
				message: error.name,
				details: {
					errors: error.flatten().fieldErrors,
				},
				stack: error.stack,
			},
			{ status: HTTP_STATUSES.UNPROCESSABLE_ENTITY.CODE },
		);
	}
};