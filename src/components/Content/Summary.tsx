import type { categories, post_category, posts } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export type IPost = posts & {
  post_category: (post_category & { category: categories })[];
};

export interface ISummaryProps {
  article: IPost;
}

export default function Summary(props: ISummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      {props.article && (
        <>
          <article className="flex flex-wrap sm:flex-col md:mb-20 md:flex-row">
            <div className="article-image rounded-md md:w-5/12 ">
              <Link href={`/${props.article.slug}`} scroll={false}>
                <Image
                  src={props.article.thumbnail_path as string}
                  alt={props.article.title}
                  width="0"
                  height="0"
                  sizes="40vw"
                  loading="lazy"
                  className="w-full h-auto rounded-md"
                />
              </Link>
            </div>
            <div className="article-excerpt flex flex-col justify-center py-10 md:w-7/12 md:py-0 md:pl-20">
              <h2 className="mb-4 text-3xl font-semibold text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-gray-500">
                <Link
                  href={`/${props.article.slug}`}
                  className="block"
                  scroll={false}
                >
                  {props.article.title}
                </Link>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {props.article.content}
              </p>
              <div className="mt-2 text-sm text-gray-400 dark:text-gray-600">
                <span>
                  {props.article.created_at?.toLocaleTimeString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
                <span className="mx-2">·</span>
                {props.article.post_category &&
                  props.article.post_category.map((item, index, arr) => {
                    return (
                      <span key={`${item.category.slug}-${index}`}>
                        <Link
                          href={`/category/${item.category.slug}`}
                          scroll={false}
                        >
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
        </>
      )}
    </motion.div>
  );
}
