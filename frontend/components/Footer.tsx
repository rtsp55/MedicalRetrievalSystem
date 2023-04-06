import { FC, memo } from "react";

type FooterProps = {
  className?: string;
};

const Footer: FC<FooterProps> = memo(({ className }) => <footer></footer>);

Footer.displayName = "Footer";
export { Footer };
