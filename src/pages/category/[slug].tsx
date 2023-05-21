import { AnimatePresence } from "framer-motion";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import AnimatedLayout from "~/components/AnimatedLayout";
import Summary from "~/components/Content/Summary";
import Error from "~/components/Error";
import SEO from "~/components/SEO";
import { api } from "~/utils/api";
import ServerSideTRPC from "~/utils/trpc_serverside";
import Loading from "../../components/Loading";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const trpc = ServerSideTRPC();

  const [category, posts] = await Promise.all([
    trpc.category.show.fetch({
      slug: context.query.slug as string,
    }),
    trpc.category.initialPosts.fetch({
      slug: context.query.slug as string,
      page: 1,
      per_page: 6,
    }),
  ]);

  if (!category || !posts) {
    return {
      props: { category: null, posts: null },
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: trpc.dehydrate(),
      category,
      posts,
    },
  };
}

export default function Category(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { category, posts } = props;

  const { ref, inView } = useInView();

  const router = useRouter();

  const {
    status,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.category.infinitePosts.useInfiniteQuery(
    {
      limit: 5,
      slug: router.query.slug as string,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: Infinity,
      initialData: () => {
        if (!posts) return;
        let nextCursor: number | undefined = undefined;
        if (posts.length > 5) {
          const nextItem = posts.pop();
          if (nextItem) {
            nextCursor = Number(nextItem.id.toString());
          }
        }

        return {
          pages: [
            {
              items: posts,
              nextCursor: nextCursor,
            },
          ],
          pageParams: [undefined],
        };
      },
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage().catch((err) => console.log(err));
    }
  }, [inView, fetchNextPage]);

  return (
    <AnimatedLayout>
      <SEO
        title={(category ? category.title : "-") + " kategori arşivi"}
        description={(category ? category.title : "-") + " kategorisindeki yazılar arşivi. Doğukan Öksüz, Software Engineer."}
        url={"/category/" + (category ? category.slug : "-")}
      />
      <section className="mx-auto md:mb-24 mb-10 w-full max-w-6xl px-5 xl:px-0">
        <h1 className="mb-4 text-center text-4xl font-semibold text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-500">
          {category ? category.title : "-"} kategorisi
        </h1>
      </section>
      <section className="mx-auto w-full max-w-6xl px-5 xl:px-0">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <Error statusCode="500" />
        ) : (
          <>
            {data &&
              data.pages &&
              data.pages.map((page) => (
                <React.Fragment key={page.nextCursor}>
                  <AnimatePresence>
                    {page.items.map((article) => (
                      <Summary article={article} key={article.id.toString()} />
                    ))}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            <div>
              <div
                ref={ref}
                onClick={() => {
                  fetchNextPage().catch((err) => console.log(err));
                }}
              >
                {isFetchingNextPage ? (
                  <Loading />
                ) : (
                  hasNextPage && "Yenileri yükle"
                )}
              </div>
            </div>
            <div>{isFetching && !isFetchingNextPage ? <Loading /> : null}</div>
          </>
        )}
      </section>
    </AnimatedLayout>
  );
}
