import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Error from "~/components/Error";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const Page: NextPage = () => {
  const { status, data } = api.page.show.useQuery({
    slug: useRouter().query.slug as string,
  });

  if (status === "loading") {
    return <Loading />;
  }
  
  if (status === "error") {
    return <Error statusCode="500" />;
  }

  if (status === "success" && data === null) {
    return <Error statusCode="404" />;
  }

  return (
    <>
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
    </>
  );
};

export default Page;
