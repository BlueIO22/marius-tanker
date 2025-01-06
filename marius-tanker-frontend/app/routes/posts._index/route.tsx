import { useLoaderData } from "@remix-run/react";
import PostCard from "~/routes/lib.client/postCard/PostCard";
import { cn } from "~/routes/lib.client/utils";
import { SanityPost } from "~/types/sanity";
import { ALL_POSTS } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity.server";

export async function loader() {
  const response = await client.fetch(ALL_POSTS);

  return {
    posts: response as SanityPost[],
  };
}

function calculateBorders(index: number, total: number) {
  return `grid-item border-0 ${(index + 1) % 3 === 2 ? "" : "border-r"} ${
    index >= total - 3 ? "" : "border-b"
  }`;
}

export default function Home() {
  const data: any = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="inline w-full text-xl font-bold border-b-2 border-white">
        Artikler
      </h1>
      <ul className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-10 border-t-2 pt-5">
        {data?.posts.map((x, index) => {
          const total = data.posts.length;
          return (
            <li key={x._id}>
              <PostCard
                hideExtraInfo
                post={x}
                className={cn(
                  "!grid-cols-1  shadow-none hover:border-4 hover:!border-inherit ",
                  calculateBorders(index, total)
                )}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
