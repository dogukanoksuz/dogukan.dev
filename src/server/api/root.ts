import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./routers/post";
import { categoryRouter } from "./routers/category";
import { tagRouter } from "./routers/tag";
import { pageRouter } from "./routers/page";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  category: categoryRouter,
  tag: tagRouter,
  page: pageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
