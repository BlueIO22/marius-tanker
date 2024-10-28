import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { useEffect } from "react";
import { useReadLocalStorage } from "usehooks-ts";
import "./global.css";
import SearchInput from "./lib/search/SearchInput";
import ToggleTheme from "./lib/toggleTheme/ToggleTheme";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const headers: HeadersFunction = () => ({
  "Cache-Control": "public, max-age=300, s-maxage=3600",
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const isDarkMode = useReadLocalStorage("marius-tanker-theme");

  useEffect(() => {
    if (window === undefined) {
      return;
    }
    if (isDarkMode) {
      window.document.documentElement.classList.toggle("dark", true);
    } else {
      window.document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  return (
    <div className="overflow-hidden dark:bg-black flex pt-5 pl-5 pr-5 flex-col  lg:p-10 lg:max-w-[1000px] m-auto">
      <div
        style={{
          transition: "all 1s linear",
        }}
        className="flex flex-row gap-5 justify-between items-center"
      >
        <div>
          <h1 className="fall-like-drunk lg:text-5xl text-2xl ">
            <Link className="hover:underline" to="/">
              Velkommen til Marius Tanker
            </Link>
          </h1>
          <p className="text-fly-in italic text-xl mt-2">
            - en koselig side med mye rart
          </p>
        </div>
        <div className="flex">
          <ToggleTheme />
          <SearchInput />
        </div>
      </div>

      <div className="mt-5">
        {" "}
        <Outlet />
      </div>

      <footer className="p-5"></footer>
    </div>
  );
}
