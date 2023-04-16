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
    .query(({ ctx, input }) => {
      return ctx.prisma.posts.findMany({
        where: {
            post_tag: {
                some: {
                    tag: {
                        slug: input.slug,
                    }
                }
            }
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
      });
    }),
});
