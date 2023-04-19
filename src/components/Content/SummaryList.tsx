import Summary, { type IPost } from "./Summary";

export interface ISummaryListProps {
  articles: IPost[];
}

export default function SummaryList(props: ISummaryListProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 xl:px-0">
      {props.articles &&
        props.articles.map(function (article, index) {
          return <Summary article={article} key={index} />;
        })}
    </section>
  );
}
