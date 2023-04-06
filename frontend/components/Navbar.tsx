import { FC, memo } from "react";

import { useRouter } from "next/router";
import { useTheme } from "@contexts";

import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { SearchBar } from "@components";

import { Moon, Sun } from "@icons";

type NavbarProps = {
  className?: string;
};

const Navbar: FC<NavbarProps> = memo(({ className }) => {
  const { pathname } = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <nav
        className={twMerge(
          "navbar sticky top-0 z-10 flex justify-between items-center md:min-h-[5rem] bg-base-100",
          pathname === "/" ? "justify-end" : "md:border-b",
          className
        )}
      >
        {pathname !== "/" && (
          <Link className="flex-shrink-0" href="/" title="Go to Ask Med home">
            <h3>Ask Med</h3>
          </Link>
        )}

        {pathname !== "/" && <SearchBar className="hidden md:inline-flex" />}

        <div className="space-x-2" title="Toggle theme">
          <input
            className="toggle toggle-primary toggle-sm"
            type="checkbox"
            checked={theme === "winter"}
            onChange={(e) => setTheme(e.target.checked ? "winter" : "night")}
          />

          <label className="swap swap-rotate">
            <input
              type="checkbox"
              checked={theme === "winter"}
              onChange={(e) => setTheme(e.target.checked ? "winter" : "night")}
            />

            <Sun className="swap-on text-primary" />
            <Moon className="swap-off text-base-content/50" />
          </label>
        </div>
      </nav>

      {pathname !== "/" && (
        <SearchBar className="md:hidden sticky top-16 z-10 pb-4 bg-base-100 border-b" />
      )}
    </>
  );
});

Navbar.displayName = "Navbar";
export { Navbar };
