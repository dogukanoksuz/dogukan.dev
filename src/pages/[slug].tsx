import debounce from "lodash/debounce";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Loading from "~/components/Partials/Loading";
import Progress from "~/components/Progress";
import { api } from "~/utils/api";

const Post: NextPage = () => {
  const router = useRouter();

  const [contentHeight, setContentHeight] = useState<number>(0);

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

  const post = api.post.show.useQuery({
    slug: router.query.slug as string,
  });

  return (
    <>
      <Head>
        {post.data && <title>{post.data.title} - Doğukan Öksüz</title>}
      </Head>

      <>
        {post.data ? (
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

            <h1>{post.data.title}</h1>
            <div className="mt-2 text-sm text-gray-400 dark:text-gray-600">
              {post.data.created_at?.toDateString()}
              <span className="mx-2">·</span>
              {post.data.post_category &&
                post.data.post_category.map((item, index, arr) => {
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
            {post.data.post_tag &&
              post.data.post_tag.map((item, index, arr) => {
                return (
                  <span key={`${item.tag.slug}-${index}`}>
                    <Link href={`/tag/${item.tag.slug}`} className="text-xs">
                      #{item.tag.name}
                    </Link>
                    {index !== arr.length - 1 && <span>,&nbsp;</span>}
                  </span>
                );
              })}
            <p dangerouslySetInnerHTML={{ __html: post.data.content }} />
          </article>
        ) : (
          <Loading />
        )}
      </>
    </>
  );
};

export default Post;
