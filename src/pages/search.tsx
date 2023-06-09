import { AnimatePresence } from "framer-motion";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AnimatedLayout from "~/components/AnimatedLayout";
import Summary from "~/components/Content/Summary";
import Error from "~/components/Error";
import SEO from "~/components/SEO";
import { api } from "~/utils/api";
import Loading from "../components/Loading";

const Search: NextPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");

  const { ref, inView } = useInView();

  useEffect(() => {
    if (router.query.query && router.query.query !== "") {
      setQuery(router.query.query as string);
    }
  }, [router.query.query]);

  const {
    status,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.search.infinitePosts.useInfiniteQuery(
    {
      query,
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage().catch((err) => console.log(err));
    }
  }, [inView, fetchNextPage]);

  return (
    <>
      <SEO
        title={`${query} araması`}
        description={`${query} aramasında yazılmış makaleler. Doğukan Öksüz, Web Developer`}
        url={`/search?query=${query}`}
      />

      <AnimatedLayout>
        <section className="mx-auto md:mb-24 mb-10 w-full max-w-6xl px-5 xl:px-0">
          <h1 className="mb-4 text-center text-4xl font-semibold text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-500">
            &quot;{query}&quot; araması
          </h1>
        </section>
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
                    {page.items.length === 0 && (
                      <div className="mb-32 text-center text-gray-800 dark:text-gray-300">
                        <p className="text-3xl font-semibold">
                          Sonuç bulunamadı
                        </p>
                        <p className="text-xl">
                          Arama kriterlerinizi değiştirin
                        </p>
                      </div>
                    )}
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
              <div>
                {isFetching && !isFetchingNextPage ? <Loading /> : null}
              </div>
            </>
          )}
        </section>
      </AnimatedLayout>
    </>
  );
};

export default Search;
