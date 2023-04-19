import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { AppRouter } from "~/server/api/root";
import { motion } from "framer-motion";

type RouterTypes = inferRouterOutputs<AppRouter>;
type IPost = RouterTypes["post"]["read"];

type ISinglePost = IPost[0];

export interface ISummaryProps {
  article: ISinglePost;
}

export default function Summary(props: ISummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <article className="flex flex-wrap sm:flex-col md:mb-20 md:flex-row">
        <div className="article-image rounded-md md:w-5/12 ">
          <Link href={`/${props.article.slug}`}>
            <img
              src={`https://dogukan.dev/${
                props.article.thumbnail_path as string
              }`}
              alt={props.article.title}
              className="w-100 h-auto rounded-md shadow-xl"
            />
          </Link>
        </div>
        <div className="article-excerpt flex flex-col justify-center py-10 md:w-7/12 md:py-0 md:pl-20">
          <h2 className="mb-4 text-3xl font-semibold text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-500">
            <Link href={`/${props.article.slug}`} className="block">
              {props.article.title}
            </Link>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {props.article.content}
          </p>
          <div className="mt-2 text-sm text-gray-400 dark:text-gray-600">
            <span>{(props.article.updated_at as Date).toString()}</span>
            <span className="mx-2">·</span>
            {props.article.post_category &&
              props.article.post_category.map((item, index, arr) => {
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
            <span>Doğukan Öksüz</span>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
