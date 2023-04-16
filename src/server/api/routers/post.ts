import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  read: publicProcedure
    .input(z.object({
        page: z.number().default(1),
        per_page: z.number().default(10),
    }))
    .query(({ ctx, input }) => {
        return ctx.prisma.posts.findMany({
            skip: (input.page - 1) * input.per_page,
            take: input.per_page,
            orderBy: {
                created_at: 'desc',
            }
        });
  }),
  show: publicProcedure
    .input(z.object({
        slug: z.string().default(''),
    }))
    .query(({ ctx, input }) => {
        return ctx.prisma.posts.findUnique({
            where: {
                slug: input.slug,
            },
            include: {
                post_category: {
                    include: {
                        category: true,
                    }
                },
                post_tag: {
                    include: {
                        tag: true,
                    }
                },
            }
        });
    }),
});
