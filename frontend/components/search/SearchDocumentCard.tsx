import { FC, memo, useMemo, useState } from "react";

import { twMerge } from "tailwind-merge";
import { beautifyText, extractExcerpt } from "@utils";

type SearchDocumentCardProps = {
  className?: string;

  searchDocument: SearchDocument;
  query: string;
};

const SearchDocumentCard: FC<SearchDocumentCardProps> = memo(
  ({ className, searchDocument, query }) => {
    const [expand, setExpand] = useState(false);

    const keywords = useMemo(() => query.toLowerCase().split(/\s+/), [query]);
    const excerpt = useMemo(
      () => extractExcerpt(searchDocument.content, keywords),
      [searchDocument.content, keywords]
    );

    return (
      <div
        className={twMerge(
          "card flex flex-col items-start px-4 md:px-6 pt-2 pb-5 w-full bg-base-100 shadow-lg cursor-pointer",
          className
        )}
        onClick={() => setExpand((expand) => !expand)}
        title={expand ? "Click to collapse" : "Click to expand"}
      >
        <div className="breadcrumbs" onClick={(e) => e.persist()}>
          <ul>
            {searchDocument.title.split("/").map((breadcrumb, index) => (
              <li key={index}>
                <b>{breadcrumb}</b>
              </li>
            ))}
          </ul>
        </div>

        <p
          className={twMerge(expand ? "cursor-text" : "line-clamp-2")}
          onClick={(e) => expand && e.stopPropagation()}
        >
          {beautifyText(expand ? searchDocument.content : excerpt)
            .split(/\s+/)
            .map((word, index) => (
              <span
                key={index}
                className={twMerge(keywords.includes(word) && "font-bold")}
              >
                {word}{" "}
              </span>
            ))}
        </p>
      </div>
    );
  }
);

SearchDocumentCard.displayName = "SearchDocumentCard";
export { SearchDocumentCard };
