import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { Excerpt } from "~/utils/excerpt";

export const postRouter = createTRPCRouter({
  read: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        per_page: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.prisma.posts.findMany({
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        orderBy: {
          created_at: "desc",
        },
        include: {
          post_category: {
            include: {
              category: true,
            },
          },
        },
      });

      results.forEach((result) => {
        result.content = Excerpt(result.content);
      });

      return results;
    }),
  show: publicProcedure
    .input(
      z.object({
        slug: z.string().default(""),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.posts.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          post_category: {
            include: {
              category: true,
            },
          },
          post_tag: {
            include: {
              tag: true,
            },
          },
        },
      });
    }),
  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await prisma.posts.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          created_at: "desc",
        },
        include: {
          post_category: {
            include: {
              category: true,
            },
          },
        },
      });

      items.forEach((result) => {
        result.content = Excerpt(result.content);
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = Number(nextItem!.id.toString());
      }
      return {
        items,
        nextCursor,
      };
    }),
});
