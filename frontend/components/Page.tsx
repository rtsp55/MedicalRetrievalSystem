import { FC, memo, PropsWithChildren } from "react";

import { twMerge } from "tailwind-merge";
import { Footer, Loader, Navbar } from "@components";

type PageProps = {
  className?: string;
  loading?: boolean;
};

const Page: FC<PropsWithChildren<PageProps>> = memo(
  ({ className, loading = false, children }) => (
    <div className="container relative flex flex-col items-stretch min-h-screen">
      <Navbar />

      {loading ? (
        <Loader />
      ) : (
        <main
          className={twMerge(
            "flex-1 flex flex-col items-stretch px-2 pt-4 pb-8 w-full",
            className
          )}
        >
          {children}
        </main>
      )}

      <Footer />
    </div>
  )
);

Page.displayName = "Page";
export { Page };
