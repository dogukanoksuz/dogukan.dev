import { createServerSideHelpers } from "@trpc/react-query/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default function ServerSideTRPC() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: createTRPCContext({} as CreateNextContextOptions),
    transformer: superjson,
  });
}
