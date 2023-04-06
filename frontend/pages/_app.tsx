import "../styles/globals.scss";

import type { AppProps } from "next/app";

import { ThemeProvider } from "@contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Head from "next/head";

const AskMedApp = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();
  return (
    <>
      <Head>
        <title>Med Search Engine</title>
        <link rel="icon" type="image/x-icon" href="/logo.svg" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default AskMedApp;
