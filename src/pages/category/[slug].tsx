import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import AnimatedLayout from "~/components/AnimatedLayout";
import SummaryList from "~/components/Content/SummaryList";
import ServerSideTRPC from "~/utils/trpc_serverside";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const trpc = ServerSideTRPC();

  const [category, posts] = await Promise.all([
    trpc.category.show.fetch({
      slug: context.query.slug as string,
    }),
    trpc.category.getPosts.fetch({
      slug: context.query.slug as string,
    }),
  ]);

  if (!category || !posts) {
    return {
      props: { category: null, posts: null },
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: trpc.dehydrate(),
      category,
      posts,
    },
  };
}

export default function Category(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { category, posts } = props;

  return (
    <AnimatedLayout>
      <section className="mx-auto mb-24 w-full max-w-6xl px-5 xl:px-0">
        <h1 className="mb-4 text-center text-4xl font-semibold text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-500">
          {category ? category.title : "-"} kategorisi
        </h1>
      </section>
      <SummaryList articles={posts as NonNullable<typeof posts>} />
    </AnimatedLayout>
  );
}
