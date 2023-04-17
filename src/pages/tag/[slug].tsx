import { type NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { api } from "~/utils/api";
import SummaryList from "~/components/Content/SummaryList";
import Loading from "~/components/Loading";
import Error from "~/components/Error";

const Category: NextPage = () => {
  const tag = api.tag.show.useQuery({
    slug: useRouter().query.slug as string,
  });

  const { status, data } = api.tag.getPosts.useQuery({
    slug: useRouter().query.slug as string,
  });

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    return <Error statusCode="500" />;
  }

  if (status === "success" && (data === undefined || data.length === 0)) {
    return <Error statusCode="404" />;
  }

  return (
    <>
      <Head>
        <title>Doğukan Öksüz - dogukan.dev</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <section className="mx-auto mb-24 w-full max-w-6xl px-5 xl:px-0">
        <h1 className="mb-4 text-center text-4xl font-semibold text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-500">
          {tag.data ? tag.data.name : "-"} etiket arşivi
        </h1>
      </section>
      <SummaryList articles={data} />
    </>
  );
};

export default Category;
