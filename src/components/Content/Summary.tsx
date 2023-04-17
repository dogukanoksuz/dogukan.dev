import { type posts } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export interface ISummaryProps {
    article: posts
}

export default function Summary(props: ISummaryProps) {
    return (
        <article className="flex flex-wrap md:flex-row sm:flex-col md:mb-20">
            <div className="article-image md:w-5/12 rounded-md ">
                <Link href={`/${props.article.slug}`}>
                    <img
                        src={`https://dogukan.dev/${props.article.thumbnail_path as string}`}
                        alt={props.article.title}
                        className="rounded-md shadow-xl w-100 h-auto"
                    />
                </Link>
            </div>
            <div className="article-excerpt md:w-7/12 md:pl-20 flex justify-center flex-col py-10 md:py-0">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-gray-500">
                    <Link
                        href={`/${props.article.slug}`}
                        className="block"
                    >
                        {props.article.title}
                    </Link>
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Content gelecek.
                </p>
                <div className="mt-2 text-gray-400 text-sm dark:text-gray-600">
                    <span>
                        {(props.article.updated_at as Date).toString()}
                    </span>
                    &nbsp; · &nbsp;
                    <span>
                        Doğukan Öksüz
                    </span>
                </div>
            </div>
        </article>
    );
}
