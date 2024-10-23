import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SanityPost } from "types/sanity";
import { LATEST_POSTS } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";

export const loader = async () => {
  const response = await client.fetch(LATEST_POSTS);

  return response as SanityPost[];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Marius Tanker" },
    {
      name: "description",
      content: "Velkommen til Marius tanker, en koselig liten side",
    },
  ];
};

export default function Index() {
  const latestPosts = useLoaderData<typeof loader>();

  return (
    <div className="p-10 w-full justify-start">
      <h1 className="inline w-full text-xl font-bold border-b-2 border-white">
        Latest and greatest!
      </h1>
      <ul className="flex p-10 flex-col gap-5">
        {latestPosts.map((post: SanityPost) => {
          return (
            <Link key={post._id} to={"/posts/" + post.slug}>
              <li className="flex items-center p-5 gap-5 hover:bg-white hover:text-black cursor-pointer">
                <div className="">
                  <img
                    className="w-[200px] object-cover object-center"
                    src={post.previewImageUrl}
                    alt={post.title}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{post.title}</h2>
                  <p className="text-xl">{post.subtitle}</p>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
