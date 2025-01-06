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
import SearchInput from "./routes/lib.client/search/SearchInput";
import ToggleTheme from "./routes/lib.client/toggleTheme/ToggleTheme";
import tailwind from "./tailwind.css?url";
import fontawesomestyles from "@fortawesome/fontawesome-svg-core/styles.css?url";
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
import { faHamburger } from "@fortawesome/free-solid-svg-icons";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload stylesheet",
    href: fontawesomestyles,
  },
  {
    rel: "preload stylesheet",
    href: tailwind,
  },
];

export const headers: HeadersFunction = () => ({
  "Cache-Control": "public, max-age=300, s-maxage=3600",
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  const isCommentsEnabled = process.env.IS_COMMENTS_ENABLED === "true";

  const user = await authenticator.isAuthenticated(request);

  return {
    user,
    isCommentsEnabled,
  };
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
  const { user, isCommentsEnabled } = useLoaderData<typeof loader>();
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
      <div className="overflow-auto flex-col m-auto">
        <div
          style={{
            transition: "all 1s linear",
          }}
          className="fixed bg-primary z-[20] pt-5 pl-5 pr-5 w-full"
        >
          <div className=" w-full flex flex-col lg:flex-row justify-center items-center overflow-auto ">
            <div className="flex flex-col lg:flex-row lg:justify-between justify-center items-center gap-5 pb-2 w-fit lg:gap-[10rem]">
              <div className="lg:col-span-2 flex flex-col justify-start col-span-5">
                <h1 className="lg:text-2xl text-2xl ">
                  <Link className="hover:underline" to="/">
                    Velkommen til Marius Tanker
                  </Link>
                </h1>
                <p className="text-fly-in italic text-lg mt-2">
                  - en koselig side med mye rart
                </p>
              </div>
              <ul className="col-span-3 lg:col-span-2 items-center hidden lg:flex flex-row gap-2 justify-center [&>li>a]:p-2 [&>li>a]:border-2 [&>li>a]:border-primary hover:[&>li>a]:border-secondary [&>li>a]:cursor-pointer [&>li>a]:rounded-lg hover:[&>li>a]:bg-secondary hover:[&>li>a]:text-primary hover:[&>li>a]:shadow-lg [&>li>a]:transition ">
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
              <div className="lg:hidden flex col-span-1">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full">
                    <div className="rounded-lg text-3xl border-secondary hover:bg-secondary hover:text-primary transition-all flex items-center gap-2">
                      <FontAwesomeIcon icon={faHamburger} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mx-10 p-10 flex flex-col gap-2 ">
                    <Link to={"/"}>
                      <DropdownMenuItem className="cursor-pointer text-2xl underline">
                        Hjem
                      </DropdownMenuItem>
                    </Link>
                    <Link to={"/posts"}>
                      <DropdownMenuItem className="cursor-pointer text-2xl underline">
                        Artikler
                      </DropdownMenuItem>
                    </Link>
                    <Link to={"/author"}>
                      <DropdownMenuItem className="cursor-pointer text-2xl underline">
                        Forfattere
                      </DropdownMenuItem>
                    </Link>
                    <div className="col-span-6 lg:col-span-2 lg:hidden gap-2 justify-center items-center flex">
                      {isCommentsEnabled && (
                        <>
                          {!user ? (
                            <Form action="/auth/github" method="post">
                              <button className="rounded-lg lg:w-[120px] lg:border-2 border-secondary p-2 hover:bg-secondary hover:text-primary transition-all flex items-center gap-2">
                                <div className="text-lg">
                                  <GitHubLogoIcon
                                    className="lg:hidden"
                                    height={24}
                                    width={24}
                                  />
                                  <GitHubLogoIcon
                                    className="hidden lg:block"
                                    height={24}
                                    width={24}
                                  />
                                </div>
                                <span className="hidden lg:block">
                                  Logg inn
                                </span>
                              </button>
                            </Form>
                          ) : (
                            <div className="flex">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <div className="rounded-lg border-2 border-secondary p-2 hover:bg-secondary hover:text-primary transition-all flex items-center gap-2">
                                    <GitHubLogoIcon height={24} width={24} />{" "}
                                    {(user as any)?.displayName}
                                  </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>
                                    God {dayOfTheWeek}{" "}
                                    {(user as any)?.name.givenName}
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
                                      <div className="w-full text-left">
                                        Log out
                                      </div>
                                    </Form>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex flex-row items-center">
                        <ToggleTheme />
                        <SearchInput />
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="col-span-6 lg:col-span-2 lg:flex gap-2 justify-center items-center hidden">
                {isCommentsEnabled && (
                  <>
                    {!user ? (
                      <Form action="/auth/github" method="post">
                        <button className="rounded-lg lg:w-[120px] lg:border-2 border-secondary p-2 hover:bg-secondary hover:text-primary transition-all flex items-center gap-2">
                          <div className="text-lg">
                            <GitHubLogoIcon
                              className="lg:hidden"
                              height={24}
                              width={24}
                            />
                            <GitHubLogoIcon
                              className="hidden lg:block"
                              height={24}
                              width={24}
                            />
                          </div>
                          <span className="hidden lg:block">Logg inn</span>
                        </button>
                      </Form>
                    ) : (
                      <div className="flex">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <button className="rounded-lg border-2 border-secondary p-2 hover:bg-secondary hover:text-primary transition-all flex items-center gap-2">
                              <GitHubLogoIcon height={24} width={24} />{" "}
                              {(user as any)?.displayName}
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
                                <button className="w-full text-left">
                                  Log out
                                </button>
                              </Form>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </>
                )}
                <div className="flex flex-row items-center">
                  <ToggleTheme />
                  <SearchInput />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-0 lg:max-w-[1000px] mt-[150px] lg:mt-[150px] m-auto"
          style={{
            backgroundColor: "transparent",
          }}
        >
          <Outlet />
        </div>

        <footer className="p-5"></footer>
      </div>
    </>
  );
}
