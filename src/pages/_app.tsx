import { type AppType } from "next/app";
import { GlobalStateProvider } from "~/context/GlobalStateProvider";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import React, { useEffect } from "react";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }

    document.body.classList.add("min-h-screen", "antialiased", "dark:bg-black", "bg-gray-50")
  }, [])

  return (
    <>
      <GlobalStateProvider>
        <Head>
          <title>Doğukan Öksüz - dogukan.dev</title>
          <meta name="description" content="Doğukan Öksüz'ün kişisel blog sitesi" />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </GlobalStateProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
