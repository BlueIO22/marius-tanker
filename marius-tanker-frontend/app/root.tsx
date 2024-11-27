import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { useEffect } from "react";
import { useReadLocalStorage } from "usehooks-ts";
import "./global.css";
import SearchInput from "./lib/search/SearchInput";
import ToggleTheme from "./lib/toggleTheme/ToggleTheme";
import tailwind from "./tailwind.css?url";
import { authenticator } from "./service/auth.server";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faHamburger } from "@fortawesome/free-solid-svg-icons";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DynaPuff:wght@400..700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "fontawesomestyles.css",
  },
  {
    rel: "stylesheet",
    href: tailwind,
  },
];

export const headers: HeadersFunction = () => ({
  "Cache-Control": "public, max-age=300, s-maxage=3600",
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  return user;
};

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

function getDayOfTheWeek() {
  const date = new Date();
  const dayOfTheWeek = date.toLocaleDateString("no-NO", { weekday: "long" });
  return dayOfTheWeek;
}

export default function App() {
  const isDarkMode = useReadLocalStorage("marius-tanker-theme");
  const user = useLoaderData<typeof loader>();
  const dayOfTheWeek = getDayOfTheWeek();
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
    <>
      <div className="overflow-auto  flex-col m-auto">
        <div
          style={{
            transition: "all 1s linear",
          }}
          className="fixed bg-primary border-b-2 z-[20] pt-5 pl-5 pr-5 pb-5  w-full"
        >
          <div className=" w-auto flex flex-col lg:flex-row gap-5 justify-between items-center overflow-auto">
            <div className=" flex flex-row lg:flex-col">
              <div>
                <h1 className="fall-like-drunk lg:text-2xl text-2xl ">
                  <Link className="hover:underline" to="/">
                    Velkommen til Marius Tanker
                  </Link>
                </h1>
                <p className="text-fly-in italic text-lg mt-2">
                  - en koselig side med mye rart
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 items-center">
              <ul className="flex flex-row gap-2 justify-center [&>li>a]:p-2 [&>li>a]:border-2 [&>li>a]:border-primary hover:[&>li>a]:border-secondary [&>li>a]:cursor-pointer [&>li>a]:rounded-lg hover:[&>li>a]:bg-secondary hover:[&>li>a]:text-primary hover:[&>li>a]:shadow-lg [&>li>a]:transition ">
                <li>
                  <Link to="/">Hjem</Link>
                </li>
                <li>
                  <Link to="/posts">Artikler</Link>
                </li>
                <li>
                  <Link to="/author">Forfattere</Link>
                </li>
              </ul>
              {!user ? (
                <Form action="/auth/github" method="post">
                  <button className="rounded-lg lg:w-[120px] lg:border-2 border-secondary p-2 hover:bg-secondary hover:text-primary transition-all flex items-center gap-2">
                    <GitHubLogoIcon />{" "}
                    <span className="hidden lg:block">Logg inn</span>
                  </button>
                </Form>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <button className="rounded-lg border-2 border-secondary p-2 hover:bg-secondary hover:text-primary transition-all flex items-center gap-2">
                        <GitHubLogoIcon /> {(user as any)?.displayName}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        God {dayOfTheWeek} {(user as any)?.name.givenName}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link to={"/comments"}>
                        <DropdownMenuItem className="cursor-pointer">
                          Kommentarer
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Form
                          className="w-full"
                          action="/auth/github/logout"
                          method="post"
                        >
                          <button className="w-full text-left">Log out</button>
                        </Form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              <ToggleTheme />
              <SearchInput />
            </div>
          </div>
        </div>

        <div
          className="lg:p-10 lg:max-w-[1000px] mt-[200px]   m-auto"
          style={{
            backgroundColor: "transparent",
          }}
        >
          {" "}
          <Outlet />
        </div>

        <footer className="p-5"></footer>
      </div>
    </>
  );
}
