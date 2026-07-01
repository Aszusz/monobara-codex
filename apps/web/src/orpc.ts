import type { AppRouter } from "@monobara/contract";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";

const link = new RPCLink({
  url: import.meta.env.VITE_API_URL ?? new URL("/rpc", location.origin),
});

export const orpc: ContractRouterClient<AppRouter> = createORPCClient(link);
