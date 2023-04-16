import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pageRouter = createTRPCRouter({
  show: publicProcedure.
    input(z.object({
        slug: z.string().default(""),
    }))
    .query(({ ctx, input }) => {
        return ctx.prisma.pages.findFirst({
            where: {
                slug: input.slug,
            },
        });
    })
});
