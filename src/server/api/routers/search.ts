import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { Excerpt } from "~/utils/excerpt";

export const searchRouter = createTRPCRouter({
  infinitePosts: publicProcedure
    .input(
      z.object({
        query: z.string().default(""),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await prisma.posts.findMany({
        take: limit + 1,
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
        where: {
          OR: [
            {
              title: {
                contains: input.query,
              },
            },
            {
              content: {
                contains: input.query,
              },
            },
          ],
        } as Prisma.postsWhereInput,
      });

      items.forEach((result) => {
        result.content = Excerpt(result.content);
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        if (nextItem) {
          nextCursor = Number(nextItem.id.toString());
        }
      }
      return {
        items,
        nextCursor,
      };
    }),
});
