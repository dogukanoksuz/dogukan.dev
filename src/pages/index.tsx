import { type NextPage } from "next";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import AnimatedLayout from "~/components/AnimatedLayout";
import Jumbotron from "~/components/Partials/Jumbotron";
import { api } from "~/utils/api";
import Loading from "./loading";
import Summary from "~/components/Content/Summary";
import Error from "~/components/Error";
import { AnimatePresence } from "framer-motion";

const Home: NextPage = () => {
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
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <AnimatedLayout>
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
              <div ref={ref} onClick={() => fetchNextPage()}>
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
};

export default Home;
