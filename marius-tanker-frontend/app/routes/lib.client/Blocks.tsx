import {
  SanityAuthor,
  SanityBlockObject,
  SanityGrid,
  SanityPost,
} from "~/types/sanity";
import PostCard from "./postCard/PostCard";
import AuthorPreviewPosts from "./AuthorPreviewPosts";
import StaticPostCard from "./postCard/StaticPostCard";

export default function Blocks({ blocks }: { blocks: SanityBlockObject[] }) {
  return blocks.map((block: SanityBlockObject) => {
    switch (block._type) {
      case "grid":
        return (
          <div className="pt-5 shadow-none my-10 ">
            <h2 className="ml-5 lg:ml-0 text-2xl font-bold my-5">
              {(block as SanityGrid).title}
            </h2>
            <ul
              style={{
                display: "grid",
                gridTemplateRows: `repeat(${(block as SanityGrid).rows}, 1fr)`,
              }}
              className="gap-10 grid-cols-1 lg:grid-cols-2"
            >
              {(block as SanityGrid).posts.map((post) => (
                <StaticPostCard post={post} key={post._id} />
              ))}
            </ul>
          </div>
        );

      case "post":
        return (
          <>
            <div
              className="lg:hidden my-5 lg:my-inherit border-2"
              key={block._id}
            >
              <PostCard overrideHovering post={block as SanityPost} />
            </div>
            <div className="hidden lg:block my-10" key={block._id}>
              <PostCard post={block as SanityPost} />
            </div>
          </>
        );

      case "author": {
        const authorPosts = (block as any).authorPosts;
        const author = block as SanityAuthor;

        return (
          <>
            <div className="relative">
              <img
                className="brightness-60 object-cover object-center"
                src={author.imageUrl}
                alt={author.name + " image"}
              />
              <div className="absolute lg:top-20 lg:max-h-[100px] lg:left-20 left-5 bottom-5  bg-white text-black shadow-lg rounded-lg p-2 lg:p-5">
                <h2>{author.name}</h2>
                <p className="italic text-xs">{author.occupation}</p>
                <p className=" hidden lg:inline text-xs mt-2">
                  {author.name} har skrevet {authorPosts.length} artikler
                </p>
              </div>
              <div className="absolute hidden lg:inline lg:p-20 -bottom-10 w-full  bg-transparent">
                <AuthorPreviewPosts authorPosts={authorPosts} />
              </div>
            </div>

            <div className="border-b-2 p-5 lg:hidden lg:p-20  text-black -bottom-10 w-full">
              <p className="font-bold">
                {author.name} har skrevet {authorPosts.length} artikler
              </p>
              <AuthorPreviewPosts authorPosts={authorPosts} />
            </div>
          </>
        );
      }

      default:
        return <div>Unknown block type: {block._type}</div>;
    }
  });
}
