import type { inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import type { AppRouter } from "~/server/api/root";

type RouterTypes = inferRouterOutputs<AppRouter>;
type RandomPosts = RouterTypes["post"]["getRandomPosts"];

interface IRandomPostsProps {
  random: RandomPosts | undefined;
}

const RandomPosts = (props: IRandomPostsProps) => {
  const { random } = props;

  return (
    <>
      {random && random.length > 0 && (
        <>
          <section
            id="custom-container"
            className="prose mx-auto max-w-3xl px-5
            py-3 dark:prose-light sm:prose lg:prose-lg xl:prose-xl md:py-3 lg:py-6 xl:py-12"
          >
            <h2 className="mb-0 mt-[15px] text-gray-600 dark:text-gray-400">
              Daha fazla gönderi...
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {random.map((random_post, index) => (
                <div key={index}>
                  <Link
                    href={`/${random_post.slug}`}
                    title={random_post.title}
                    className="block text-center text-gray-600 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Image
                      className="mb-[10px] max-w-full rounded-sm shadow-md"
                      src={random_post.thumbnail_path as string}
                      alt={random_post.title}
                      width="0"
                      height="0"
                      sizes="20vw"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                    {random_post.title}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default RandomPosts;
