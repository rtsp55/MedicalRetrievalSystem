import { useEffect } from "react";
import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";
import { search } from "@utils";

import Head from "next/head";
import { Loader, Page, SearchDocumentCard } from "@components";

const Search = () => {
  const {
    query: { q },
    push,
  } = useRouter();

  useEffect(() => {
    if (!q) push("/");
  }, [push, q]);

  const {
    data: result,
    isLoading: resultLoading,
    error: resultError,
  } = useQuery({
    queryKey: ["search", q],
    queryFn: () => search(q as string),
    enabled: !!q,
  });

  return (
    <Page>
      <Head>
        <title>{q} · Ask Med</title>
      </Head>

      {resultLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <h5>Results for &quot;{q ?? "..."}&quot;</h5>
          <h6 className="mt-1">
            Found {result?.length} results in {result?.duration.toFixed(6)}{" "}
            seconds
          </h6>

          <div className="flex flex-col space-y-4 mt-4 md:mt-8">
            {result?.serp.map((searchDocument, index) => (
              <SearchDocumentCard
                key={index}
                searchDocument={searchDocument}
                query={(q as string) ?? ""}
              />
            ))}
          </div>
        </>
      )}
    </Page>
  );
};

export default Search;
