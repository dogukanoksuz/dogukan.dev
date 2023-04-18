import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default function ServerSideTRPC() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: createTRPCContext({} as any),
    transformer: superjson,
  });
}
