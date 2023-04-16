import { type NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { api } from "~/utils/api";
import Loading from "~/components/Partials/Loading";
import Link from "next/link";

const Post: NextPage = () => {
  const post = api.post.show.useQuery({
    slug: useRouter().query.slug as string,
  });

  return (
    <>
      <Head>{post.data && <title>{post.data.title} - Doğukan Öksüz</title>}</Head>

      <>
        {post.data ? (
          <article
            id="article"
            data-aos="fade-up"
            className="prose relative mx-auto px-5 py-0 dark:prose-light sm:prose lg:prose-lg xl:prose-xl md:py-4 lg:py-8 xl:py-16"
          >
            <div
              id="scroll-bar-container"
              className="fixed -ml-40 block sm:hidden md:block"
            >
              <div
                style={{ height: "42vh" }}
                className="w-0.5 overflow-hidden bg-gray-300 dark:bg-gray-800"
              >
                <div
                  style={{
                    height: "42vh",
                    marginTop: "-42vh",
                    transform: "translateY(10%)",
                  }}
                  id="scroll-bar"
                  className="w-0.5 bg-gray-800 dark:bg-gray-300"
                ></div>
              </div>
            </div>
            <h1>{post.data.title}</h1>
            <div className="mt-2 text-sm text-gray-400 dark:text-gray-600">
              {post.data.created_at?.toDateString()}
              <span className="mx-2">·</span>
              {post.data.post_category &&
                post.data.post_category.map((item, index) => {
                  return (
                    <>
                      <Link
                        href={`/category/${item.category.slug}`}
                        key={index}
                      >
                        {item.category.title}
                      </Link>
                      {index !== post.data!.post_category.length - 1 ? (
                        <span>,&nbsp;</span>
                      ) : (
                        <span className="mx-2">·</span>
                      )}
                    </>
                  );
                })}
              <span itemProp="author" itemType="http://schema.org/Person">
                <span itemProp="name">Doğukan Öksüz</span>
              </span>
            </div>
            {post.data.post_tag &&
              post.data.post_tag.map((item, index) => {
                return (
                  <>
                    <Link
                      href={`/tag/${item.tag.slug}`}
                      key={index}
                      className="text-xs"
                    >
                      #{item.tag.name}
                    </Link>
                    {index !== post.data!.post_tag.length - 1 && (
                      <span>,&nbsp;</span>
                    )}
                  </>
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
