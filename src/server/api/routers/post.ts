import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { htmlDecode } from "js-htmlencode";

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
});
