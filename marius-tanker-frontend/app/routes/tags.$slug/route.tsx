import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PostCard from "~/lib/postCard/PostCard";
import { SanityPost, SanityTag } from "~/types/sanity";
import { POSTS_BY_TAG } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity.server";

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
    <div className="lg:p-10 ">
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

      <ul className="flex mt-5 flex-col gap-5">
        {data.posts.map((post: SanityPost) => {
          return <PostCard post={post} key={post._id} />;
        })}
      </ul>
    </div>
  );
}
