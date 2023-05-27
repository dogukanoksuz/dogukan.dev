import Link from "next/link";

export default function Jumbotron() {
  return (
    <section className="my-background mb-10 px-5 py-12 text-center md:mb-24">
      <div className="mx-auto w-full max-w-2xl">
        <h2 className="font-heading mb-6 mt-2 text-5xl font-semibold leading-tight dark:text-gray-300">
          Doğukan Öksüz
        </h2>
        <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
          Ben Doğukan, yazılım mühendisiyim. Web teknolojileri ve Linux üzerine
          yazılımlar geliştiriyorum. Backend geliştirmede kendime güvendiğim
          kadar frontend üzerinde de kararlı yazılımlar geliştiriyorum. Golang,
          Javascript, Typescript, NodeJS, VueJS, ReactJS, Tailwind, PHP, Laravel
          ve Linux konuları üzerinde çalışmalar yapmaktayım.
        </p>
        <div>
          <Link
            className="mr-6 inline-block rounded bg-red-500 px-8 py-4 font-semibold leading-none text-white shadow hover:bg-red-700"
            href="/page/iletisim"
            scroll={false}
          >
            İletişime geç
          </Link>
          <a className="text-red-600 hover:underline" href="#anchor">
            Makalelere göz at
          </a>
        </div>
        <div id="anchor" />
      </div>
    </section>
  );
}
