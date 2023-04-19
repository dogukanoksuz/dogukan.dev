import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import AnimatedLayout from "~/components/AnimatedLayout";
import ServerSideTRPC from "~/utils/trpc_serverside";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const trpc = ServerSideTRPC();

  const page = await trpc.page.show.fetch({
    slug: context.query.slug as string,
  });

  if (!page) {
    return {
      props: { data: null },
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: trpc.dehydrate(),
      data: page,
    },
  };
}

export default function Post(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data } = props;

  return (
    <AnimatedLayout>
      <Head>
        <title>Doğukan Öksüz - dogukan.dev</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <article
        id="article"
        data-aos="fade-up"
        className="prose relative mx-auto px-5 py-0 dark:prose-light sm:prose lg:prose-lg xl:prose-xl md:py-4 lg:py-8
  xl:py-16"
      >
        <h1>{data ? data.title : "-"}</h1>
        <div
          dangerouslySetInnerHTML={{ __html: data?.content as string }}
        />
      </article>
    </AnimatedLayout>
  );
}
