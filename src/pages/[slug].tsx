import { htmlDecode } from "js-htmlencode";
import { debounce } from "lodash";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState } from "react";
import AnimatedLayout from "~/components/AnimatedLayout";
import Loading from "~/components/Loading";
import Progress from "~/components/Progress";
import { prisma } from "~/server/db";
import ServerSideTRPC from "~/utils/trpc_serverside";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const trpc = ServerSideTRPC();

  const [post, randomPosts] = await Promise.all([
    trpc.post.show.fetch({
      slug: context.query.slug as string,
    }),
    prisma.$queryRawUnsafe(`SELECT * FROM posts ORDER BY RAND() LIMIT 3;`),
  ]);

  if (!post) {
    return {
      props: { data: null },
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: trpc.dehydrate(),
      data: post,
      random: randomPosts as typeof post[],
    },
  };
}

export default function Post(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data, random } = props;

  const [contentHeight, setContentHeight] = useState<number>(0);

  /* eslint-disable */
  const contentSectionRef = useCallback((node: any) => {
    if (node !== null) {
      const debouncedCalculation = debounce(contentSectionRef);
      const $imgs = node.querySelectorAll("img");

      $imgs.forEach(($img: any) => {
        if (!$img.complete) $img.onload = debouncedCalculation;
      });

      setContentHeight(node.getBoundingClientRect().height);
    }
  }, []);
  /* eslint-enable */

  return (
    <AnimatedLayout>
      <Head>{data && <title>{data.title} - Doğukan Öksüz</title>}</Head>

      <>
        {data ? (
          <>
            <article
              id="article"
              data-aos="fade-up"
              className="prose relative mx-auto px-5 py-0 dark:prose-light sm:prose lg:prose-lg xl:prose-xl md:py-4 lg:py-8 xl:py-16"
              ref={contentSectionRef}
            >
              <div
                id="scroll-bar-container"
                className="fixed -ml-40 block sm:hidden md:block"
              >
                <Progress contentHeight={contentHeight} />
              </div>

              <h1>{data.title}</h1>
              <div className="mt-2 text-sm text-gray-400 dark:text-gray-600">
                {data.created_at?.toLocaleTimeString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                <span className="mx-2">·</span>
                {data.post_category &&
                  data.post_category.map((item, index, arr) => {
                    return (
                      <span key={`${item.category.slug}-${index}`}>
                        <Link
                          href={`/category/${item.category.slug}`}
                          scroll={false}
                        >
                          {item.category.title}
                        </Link>
                        {index !== arr.length - 1 ? (
                          <span>,&nbsp;</span>
                        ) : (
                          <span className="mx-2">·</span>
                        )}
                      </span>
                    );
                  })}
                <span itemProp="author" itemType="http://schema.org/Person">
                  <span itemProp="name">Doğukan Öksüz</span>
                </span>
              </div>
              {data.post_tag &&
                data.post_tag.map((item, index, arr) => {
                  return (
                    <span key={`${item.tag.slug}-${index}`}>
                      <Link
                        href={`/tag/${item.tag.slug}`}
                        className="text-xs"
                        scroll={false}
                      >
                        #{item.tag.name}
                      </Link>
                      {index !== arr.length - 1 && <span>,&nbsp;</span>}
                    </span>
                  );
                })}
              <div
                dangerouslySetInnerHTML={{ __html: htmlDecode(data.content) }}
              />
            </article>

            {random && (
              <>
                <section
                  id="custom-container"
                  className="prose mx-auto max-w-3xl px-5
            py-3 dark:prose-light sm:prose lg:prose-lg xl:prose-xl md:py-3 lg:py-6 xl:py-12"
                >
                  <h2 className="mb-0 mt-[15px] text-gray-600 dark:text-gray-400">
                    Daha fazla gönderi...
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {random.map((random_post, index) => (
                      <div key={index}>
                        <Link
                          href={`/${random_post.slug}`}
                          title={random_post.title}
                          className="block text-center text-gray-600 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          <img
                            className="mb-[10px] max-w-full rounded-sm shadow-md"
                            src={`https://dogukan.dev${random_post.thumbnail_path as string}`}
                            alt={random_post.title}
                          />
                          {random_post.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        ) : (
          <Loading />
        )}
      </>
    </AnimatedLayout>
  );
}
