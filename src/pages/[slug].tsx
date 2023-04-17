import "highlight.js/styles/atom-one-dark.css";
import debounce from "lodash/debounce";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Error from "~/components/Error";
import Loading from "~/components/Loading";
import Progress from "~/components/Progress";
import { api } from "~/utils/api";
import { htmlDecode } from "js-htmlencode";

const Post: NextPage = () => {
  const { status, data } = api.post.show.useQuery({
    slug: useRouter().query.slug as string,
  });

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

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    return <Error statusCode="500" />;
  }

  if (status === "success" && !data) {
    return <Error statusCode="404" />;
  }

  return (
    <>
      <Head>{data && <title>{data.title} - Doğukan Öksüz</title>}</Head>

      <>
        {data ? (
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
              {data.created_at?.toDateString()}
              <span className="mx-2">·</span>
              {data.post_category &&
                data.post_category.map((item, index, arr) => {
                  return (
                    <span key={`${item.category.slug}-${index}`}>
                      <Link href={`/category/${item.category.slug}`}>
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
                    <Link href={`/tag/${item.tag.slug}`} className="text-xs">
                      #{item.tag.name}
                    </Link>
                    {index !== arr.length - 1 && <span>,&nbsp;</span>}
                  </span>
                );
              })}
            <div dangerouslySetInnerHTML={{ __html: htmlDecode(data.content) }} />
          </article>
        ) : (
          <Loading />
        )}
      </>
    </>
  );
};

export default Post;
