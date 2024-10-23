import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

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
  return (
    <div className="flex h-screen flex-col p-10 max-w-[1200px] m-auto">
      <div>
        <h1 className="text-5xl">
          Velkommen til{" "}
          <Link className="hover:underline" to="/">
            Marius Tanker
          </Link>
        </h1>
        <p className="italic text-xl mt-2">- en koselig side med mye rart</p>
      </div>
      <Outlet />
    </div>
  );
}
