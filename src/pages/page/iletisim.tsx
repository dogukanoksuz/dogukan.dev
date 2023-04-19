import { type NextPage } from "next";
import Head from "next/head";
import AnimatedLayout from "~/components/AnimatedLayout";

const Page: NextPage = () => {
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
        <h1>İletişim</h1>
        İletişim sayfam
      </article>
    </AnimatedLayout>
  );
};

export default Page;
