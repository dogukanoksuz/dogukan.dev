import { type NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { api } from "~/utils/api";
import SummaryList from "~/components/Content/SummaryList";

const Category: NextPage = () => {
  const tag = api.tag.show.useQuery({
    slug: useRouter().query.slug as string,
  });

  const posts = api.tag.getPosts.useQuery({
    slug: useRouter().query.slug as string,
  });

  return (
    <>
      <Head>
        <title>Doğukan Öksüz - dogukan.dev</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <section className="mx-auto w-full max-w-6xl px-5 xl:px-0 mb-24">
        <h1 className="-mb-2 mb-24 mb-4 text-center text-4xl font-semibold text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-500">
          {tag.data ? tag.data.name : "-"} etiket arşivi
        </h1>
      </section>
      <SummaryList articles={posts.data} />
    </>
  );
};

export default Category;
