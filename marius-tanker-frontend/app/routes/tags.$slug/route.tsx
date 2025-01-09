import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PostCard from "~/routes/lib.client/postCard/PostCard";
import { SanityPost, SanityTag } from "~/types/sanity";
import { POSTS_BY_TAG } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity.server";
import StaticPostCard from "../lib.client/postCard/StaticPostCard";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const response = await client.fetch(POSTS_BY_TAG, {
    slug: params.slug,
  });
  return response as {
    tag: SanityTag;
    posts: SanityPost[];
  };
};

export default function TagPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-5 lg:p-10 mt-[150px] w-full lg:w-[60%] 2xl:w-[50%] m-auto ">
      {data.tag.parent ? (
        <Link
          className="font-bold hover:underline"
          to={"/tags/" + data.tag.parent.slug}
        >
          {data.tag.parent.title}
        </Link>
      ) : (
        <Link to="/tags">Alle tags</Link>
      )}
      <h1 className="text-3xl">
        {(data.tag.parent ? "- " : "") + data.tag.title} ({data.posts.length})
      </h1>

      <ul className="grid grid-cols-1 lg:grid-cols-2 mt-5 flex-col gap-5">
        {data.posts.map((post: SanityPost) => {
          return <StaticPostCard post={post} key={post._id} />;
        })}
      </ul>
    </div>
  );
}
