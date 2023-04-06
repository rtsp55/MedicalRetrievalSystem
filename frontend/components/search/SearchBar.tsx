import { FC, FormEvent, memo, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { twMerge } from "tailwind-merge";
import { MagnifyingGlass } from "@icons";

type SearchBarProps = {
  className?: string;
};

const SearchBar: FC<SearchBarProps> = memo(({ className }) => {
  const {
    query: { q },
    push,
  } = useRouter();

  const [query, setQuery] = useState(q ?? "");
  const onSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (query) push({ pathname: "/search", query: { q: query } });
    },
    [push, query]
  );

  return (
    <form
      className={twMerge("input-group justify-center max-w-lg", className)}
      onSubmit={onSearch}
    >
      <input
        className="input input-primary input-bordered w-full transition"
        placeholder="Search…"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        className="btn btn-primary btn-square"
        type="submit"
        title="Search"
      >
        <MagnifyingGlass />
      </button>
    </form>
  );
});

SearchBar.displayName = "SearchBar";
export { SearchBar };
