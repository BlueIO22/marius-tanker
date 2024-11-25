import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import PostCard from "~/lib/postCard/PostCard";
import { authenticator } from "~/service/auth.server";
import { SanityPost } from "~/types/sanity";
import { LATEST_POSTS } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";
import { json } from "@remix-run/node";

export const loader = async () => {
  const response = await client.fetch(LATEST_POSTS);

  return {
    posts: response as SanityPost[],
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
      className="lg:p-10 mt-5 w-full justify-start "
      style={{
        backgroundColor: "transparent",
      }}
    >
      <h1 className="inline w-full text-xl font-bold border-b-2 border-white">
        Latest and greatest!
      </h1>
      <ul
        style={{
          backgroundColor: "transparent",
        }}
        className="flex lg:p-10 mt-5 flex-col gap-5 backdrop-opacity-0 "
      >
        {data.posts.map((post: SanityPost) => {
          return <PostCard post={post} key={post._id} />;
        })}
      </ul>
    </div>
  );
}
