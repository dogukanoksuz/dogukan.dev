import { AnimatePresence } from "framer-motion";
import type { InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import AnimatedLayout from "~/components/AnimatedLayout";
import Summary from "~/components/Content/Summary";
import Error from "~/components/Error";
import Jumbotron from "~/components/Partials/Jumbotron";
import SEO from "~/components/SEO";
import { api } from "~/utils/api";
import ServerSideTRPC from "~/utils/trpc_serverside";
import Loading from "../components/Loading";

export async function getServerSideProps() {
  const trpc = ServerSideTRPC();

  const posts = await trpc.post.initialPosts.fetch({
    page: 1,
    per_page: 6,
  });

  if (!posts) {
    return {
      props: { posts: null },
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: trpc.dehydrate(),
      posts,
    },
  };
}

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { posts } = props;

  const { ref, inView } = useInView();

  const {
    status,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.post.infinitePosts.useInfiniteQuery(
    {
      limit: 5,
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
      <SEO />
      <Jumbotron />
      <section className="mx-auto w-full max-w-6xl px-5 xl:px-0">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <Error statusCode="500" />
        ) : (
          <>
            {data.pages.map((page) => (
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
