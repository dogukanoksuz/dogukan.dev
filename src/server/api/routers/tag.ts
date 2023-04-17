import { htmlDecode } from "js-htmlencode";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
        result.content = htmlDecode(result.content)
          .replace(/<[^>]*>?/gm, "")
          .replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
          })
          .replace(/\&nbsp;/g, "")
          .substring(0, 225) + "...";
      });

      return results;
    }),
});
