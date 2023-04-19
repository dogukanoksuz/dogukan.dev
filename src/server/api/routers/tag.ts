import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Excerpt } from "~/utils/excerpt";

export const tagRouter = createTRPCRouter({
  show: publicProcedure.
    input(z.object({
        slug: z.string().default(""),
    }))
    .query(({ ctx, input }) => {
        return ctx.prisma.tags.findFirst({
            where: {
                slug: input.slug,
            },
        });
    }),
  getPosts: publicProcedure
    .input(
      z.object({
        slug: z.string().default(""),
        page: z.number().default(1),
        per_page: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.prisma.posts.findMany({
        where: {
            post_tag: {
                some: {
                    tag: {
                        slug: input.slug,
                    }
                }
            }
        },
        include: {
          post_category: {
            include: {
              category: true,
            },
          },
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
      });

      results.forEach((result) => {
        result.content = Excerpt(result.content);
      });

      return results;
    }),
});
