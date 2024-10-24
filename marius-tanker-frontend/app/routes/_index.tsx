import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PostCard from "~/lib/postCard/PostCard";
import { SanityPost } from "~/types/sanity";
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
    <div className="lg:p-10 mt-5 w-full justify-start">
      <h1 className="inline w-full text-xl font-bold border-b-2 border-white">
        Latest and greatest!
      </h1>
      <ul className="flex lg:p-10 mt-5 flex-col gap-5">
        {latestPosts.map((post: SanityPost) => {
          return <PostCard post={post} key={post._id} />;
        })}
      </ul>
    </div>
  );
}
