import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from "next";
import Head from "next/head";
import AnimatedLayout from "~/components/AnimatedLayout";
import SummaryList from "~/components/Content/SummaryList";
import ServerSideTRPC from "~/utils/trpc_serverside";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const trpc = ServerSideTRPC();

  const [tag, posts] = await Promise.all([
    trpc.tag.show.fetch({
      slug: context.query.slug as string,
    }),
    trpc.tag.getPosts.fetch({
      slug: context.query.slug as string,
    }),
  ]);

  if (!tag || !posts) {
    return {
      props: { tag: null, posts: null },
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: trpc.dehydrate(),
      tag,
      posts
    },
  };
}

export default function Tag(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { tag, posts } = props;

  return (
    <AnimatedLayout>
      <Head>
        <title>Doğukan Öksüz - dogukan.dev</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <section className="mx-auto mb-24 w-full max-w-6xl px-5 xl:px-0">
        <h1 className="mb-4 text-center text-4xl font-semibold text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-500">
          {tag ? tag.name : "-"} etiket arşivi
        </h1>
      </section>
      <SummaryList articles={posts as NonNullable<typeof posts>} />
    </AnimatedLayout>
  );
}
