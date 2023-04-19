import type { inferRouterOutputs } from "@trpc/server";
import Summary from "./Summary";
import { AppRouter } from "~/server/api/root";

type RouterTypes = inferRouterOutputs<AppRouter>;
type IPost = RouterTypes["post"]["read"];

export interface ISummaryListProps {
  articles: IPost;
}

export default function SummaryList(props: ISummaryListProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 xl:px-0">
      {props.articles.map(function (article, index) {
        return <Summary article={article} key={index} />;
      })}
    </section>
  );
}
