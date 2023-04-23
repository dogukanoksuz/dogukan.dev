import hljs from "highlight.js";
import { debounce } from "lodash";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import "node_modules/highlight.js/styles/atom-one-dark.css";
import { useCallback, useEffect, useState } from "react";
import AnimatedLayout from "~/components/AnimatedLayout";
import Loading from "~/components/Loading";
import RandomPosts from "~/components/Partials/RandomPosts";
import Progress from "~/components/Progress";
import { api } from "~/utils/api";
import ServerSideTRPC from "~/utils/trpc_serverside";
import parse from "html-react-parser";
import Image from "next/image";
import dynamic from "next/dynamic";

const CodeBlock = dynamic(() => import("../components/Partials/CodeBlock"), {
  ssr: true,
  loading: () => <Loading />,
});

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const trpc = ServerSideTRPC();

  const post = await trpc.post.show.fetch({
    slug: context.query.slug as string,
  });

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
    },
  };
}

export default function Post(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data } = props;

  const [contentHeight, setContentHeight] = useState<number>(0);

  /* eslint-disable */
  // Element types is not supported and i couldnt fix so i used forbidden any for this.
  const contentSectionRef = useCallback((node: any) => {
    if (node !== null) {
      const debouncedCalculation = debounce(contentSectionRef);
      if (node.querySelectorAll) {
        const $imgs = node.querySelectorAll("img");

        $imgs.forEach(($img: any) => {
          if (!$img.complete) $img.onload = debouncedCalculation;
        });

        setContentHeight(node.getBoundingClientRect().height);
      }
    }
  }, []);

  // Highlightjs also cannot work with HTML elements so i had to use this workaround.
  useEffect(() => {
    document.querySelectorAll("pre").forEach((el: any) => {
      hljs.addPlugin({
        "before:highlightElement": ({ el }: any) => {
          el.textContent = el.innerText;
        },
      });
      hljs.highlightElement(el);
    });
  }, []);
  /* eslint-enable */

  const random = api.post.getRandomPosts.useQuery();

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
              {parse(data.content, {
                /* eslint-disable */
                replace: (domNode: any) => {
                  if (domNode.name === "img") {
                    const { attribs } = domNode;
                    return (
                      <Image
                        {...attribs}
                        width={attribs.width ? attribs.width : 0}
                        height={attribs.height ? attribs.height : 0}
                        sizes="60vw"
                        loading="lazy"
                        style={{
                          width: attribs.width ? attribs.width : "100%",
                          height: "auto",
                          margin: "0 auto",
                        }}
                        className="rounded-sm"
                        alt={data.title}
                      />
                    );
                  }
                  if (
                    domNode.name === "script" &&
                    domNode.attribs &&
                    domNode.attribs.src &&
                    domNode.attribs.src.includes("gist.github.com")
                  ) {
                    return <CodeBlock
                      id={domNode.attribs.src
                        .split("/")
                        .slice(-1)[0]
                        .replace(".js", "")}
                    />;
                  }
                  if (domNode.name === "gist") {
                    return <CodeBlock id={domNode.attribs.id} />;
                  }
                },
                /* eslint-enable */
              })}
            </article>

            {random.status === "success" && (
              <RandomPosts random={random.data} />
            )}
          </>
        ) : (
          <Loading />
        )}
      </>
    </AnimatedLayout>
  );
}
