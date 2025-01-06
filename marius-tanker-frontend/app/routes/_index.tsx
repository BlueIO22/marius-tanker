import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PostCard from "~/routes/lib.client/postCard/PostCard";
import { SanityBlockObject, SanityPost } from "~/types/sanity";
import { FRONTPAGE_QUERY, LATEST_POSTS } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity.server";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Blocks from "~/routes/lib.client/Blocks";
import StaticPostCard from "./lib.client/postCard/StaticPostCard";

export const loader = async () => {
  const frontpageResponse = await client.fetch(FRONTPAGE_QUERY);

  const response = await client.fetch(LATEST_POSTS);

  return {
    posts: response as SanityPost[],
    blocks: frontpageResponse.blocks as SanityBlockObject[],
  };
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
  const data: any = useLoaderData<typeof loader>();

  return (
    <div
      className="mt-5 w-full justify-start p-0"
      style={{
        backgroundColor: "transparent",
      }}
    >
      <div className="lg:w-[1000px] w-full m-auto">
        <h1 className="w-full text-center flex justify-center lg:justify-start text-xl font-bold border-white lg:pl-10">
          <span>Latest and greatest!</span>
        </h1>
        <ul
          style={{
            backgroundColor: "transparent",
          }}
          className="flex  lg:p-10 mt-5 lg:mt-0  flex-col gap-5 backdrop-opacity-0   m-auto"
        >
          {data.posts.map((post: SanityPost) => {
            return <StaticPostCard post={post} key={post._id} />;
          })}
        </ul>
      </div>

      <Blocks blocks={data.blocks} />
    </div>
  );
}
