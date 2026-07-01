import type { AppRouter } from "@monobara/api/router";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

const link = new RPCLink({
  url: import.meta.env.VITE_API_URL ?? new URL("/rpc", location.origin),
});

export const orpc: RouterClient<AppRouter> = createORPCClient(link);
