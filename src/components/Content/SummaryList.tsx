import Loading from "../Loading";
import Summary from "./Summary";
import type { posts, post_category, categories } from "@prisma/client";

type IPost = posts & {
  post_category: (post_category & {
    category: categories;
  })[];
};

export interface ISummaryListProps {
  articles: IPost[] | undefined;
}

export default function SummaryList(props: ISummaryListProps) {
  return (
    <>
      {props.articles ? (
        <section className="mx-auto w-full max-w-6xl px-5 xl:px-0">
          {props.articles.map(function (article, index) {
            return <Summary article={article} key={index} />;
          })}
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
}
