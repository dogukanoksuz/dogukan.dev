import { type NextPage } from "next";
import Image from "next/image";
import AnimatedLayout from "~/components/AnimatedLayout";
import contact from "../../assets/contact.svg";
import SEO from "~/components/SEO";
import { useRef } from "react";
import mailtolink from "mailto-link";

const Page: NextPage = () => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <AnimatedLayout>
      <SEO
        title="İletişim"
        description="Doğukan Öksüz ile bu sayfa aracılığında iletişime geçebilirsiniz."
        url={`/page/iletisim`}
      />

      <article
        id="article"
        data-aos="fade-up"
        className="prose relative mx-auto px-5 py-0 dark:prose-light sm:prose lg:prose-lg xl:prose-xl md:py-4 lg:py-8
  xl:py-16"
      >
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 text-gray-900 md:grid-cols-2">
          <div className="flex flex-col justify-between">
            <div>
              <h2
                className="text-4xl font-bold leading-tight lg:text-5xl"
                style={{
                  marginTop: "0.4em !important",
                }}
              >
                Hadi her şeyi konuşalım!
              </h2>
              <div className="mt-8 text-gray-700 dark:text-gray-300">
                Formlardan nefret mi ediyorsunuz? me[at]dogukan.dev adresinden
                bana mail gönderebilirsiniz.
              </div>
            </div>
            <div className="mt-8 text-center">
              <Image
                src={
                  // eslint-disable-next-line
                  contact
                }
                alt="İletişim"
              />
            </div>
          </div>
          <form
            id="contact"
            ref={formRef}
            onSubmit={(e: React.SyntheticEvent) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                email: { value: string };
                name: { value: string };
                message: { value: string };
              };
              const email = target.email.value;
              const name = target.name.value;
              const message = target.message.value;

              window.open(mailtolink({
                to: "me@dogukan.dev",
                subject: `Merhaba, ${name}`,
                body: `${email} - ${message}`,
              }), "_blank");
            }}
          >
            <div>
              <span className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                Adınız
              </span>
              <input
                name="name"
                className="focus:shadow-outline mt-2 w-full rounded-lg bg-gray-300 p-3 text-gray-900 focus:outline-none"
                type="text"
                placeholder=""
              />
            </div>
            <div className="mt-8">
              <span className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                Email Adresiniz
              </span>
              <input
                name="email"
                className="focus:shadow-outline mt-2 w-full rounded-lg bg-gray-300 p-3 text-gray-900 focus:outline-none"
                type="text"
              />
            </div>
            <div className="mt-8">
              <span className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                Mesajınız
              </span>
              <textarea
                name="message"
                className="focus:shadow-outline mt-2 h-32 w-full rounded-lg bg-gray-300 p-3 text-gray-900 focus:outline-none"
                defaultValue={""}
              />
            </div>
            <div className="mt-8">
              <button
                type="submit"
                id="contactButton"
                className="focus:shadow-outline w-full rounded-lg bg-red-600 p-3 text-sm font-bold uppercase tracking-wide text-gray-100 focus:outline-none"
              >
                Mesajı Gönder
              </button>
            </div>
          </form>
        </div>
      </article>
    </AnimatedLayout>
  );
};

export default Page;
