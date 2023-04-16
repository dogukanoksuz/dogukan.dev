import * as React from "react";
import Summary from "./Summary";
import { posts } from "@prisma/client";

export interface ISummaryListProps {
  articles: posts[] | undefined;
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
        <>Loading...</>
      )}
    </>
  );
}
