import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { router } from "./router";

const app = new Hono();
const handler = new RPCHandler(router, {
  interceptors: [onError(console.error)],
});

app.use("*", cors());

app.use("/rpc/*", async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    context: {},
    prefix: "/rpc",
  });

  if (matched) return c.newResponse(response.body, response);
  await next();
});

app.get("/health", (c) => c.json({ ok: true }));

Bun.serve({
  fetch: app.fetch,
  port: Number(process.env.PORT ?? 3000),
});

console.log("API listening on http://localhost:3000");
