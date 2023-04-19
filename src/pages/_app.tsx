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
  Router.events.on("routeChangeComplete", () => { NProgress.done(); setTimeout(() => scrollToTop(), 150) });
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
          <title>Doğukan Öksüz - dogukan.dev</title>
          <meta
            name="description"
            content="Doğukan Öksüz'ün kişisel blog sitesi"
          />
          <link rel="icon" href="/favicon.png" />
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
