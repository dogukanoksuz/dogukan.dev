import { AnimatePresence, motion } from "framer-motion";
import { type AppType } from "next/app";
import Head from "next/head";
import { Router, useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import { GlobalStateProvider } from "~/context/GlobalStateProvider";
import "~/styles/globals.css";
import "~/styles/nprogress.css";
import { api } from "~/utils/api";

const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const DivergentApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
    setTimeout(() => scrollToTop(), 150);
  });
  Router.events.on("routeChangeError", () => NProgress.done());

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }

    document.body.classList.add(
      "min-h-screen",
      "antialiased",
      "dark:bg-black",
      "bg-gray-50"
    );
  }, []);

  return (
    <>
      <GlobalStateProvider>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="shortcut icon" href="/favicon/favicon.png" />
          <meta content="Doğukan Öksüz" name="author" />
          <meta name="apple-mobile-web-app-title" content="Doğukan Öksüz" />
          <meta name="application-name" content="Doğukan Öksüz" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/favicon/safari-pinned-tab.svg"
            color="#ef4444"
          />
          <meta name="theme-color" content="#111111" />
          <meta name="msapplication-TileColor" content="#ff4444" />
          <meta
            name="msapplication-config"
            content="/favicon/browserconfig.xml"
          />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="p:domain_verify"
            content="2bb6c8cd01f5a281f36ec615cb8c4814"
          />
          <link
            rel="canonical"
            href={`https://dogukan.dev${
              (router.asPath === "/" ? "" : router.asPath).split("?")[0] as string
            }`}
          />
        </Head>

        <Header />
        <motion.div variants={variants} initial="hidden" animate="visible">
          <AnimatePresence mode="wait" initial={false}>
            <Component {...pageProps} key={router.asPath} />
          </AnimatePresence>
        </motion.div>
        <Footer />
      </GlobalStateProvider>
    </>
  );
};

export default api.withTRPC(DivergentApp);
