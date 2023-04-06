declare type SearchDocument = {
  title: string;
  content: string;
};

declare type SearchResult = {
  duration: number;
  length: number;

  serp: SearchDocument[];
};

declare type IconProps = {
  className?: string;
};

declare type Theme = "winter" | "night";
