import {
  SanityAuthor,
  SanityBlockObject,
  SanityGrid,
  SanityPost,
} from "~/types/sanity";
import PostCard from "./postCard/PostCard";

export default function Blocks({ blocks }: { blocks: SanityBlockObject[] }) {
  return blocks.map((block: SanityBlockObject) => {
    switch (block._type) {
      case "grid":
        return (
          <div className="p-10  shadow-xl my-10 ">
            <h2 className=" text-2xl font-bold my-5">
              {(block as SanityGrid).title}
            </h2>
            <ul
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${
                  (block as SanityGrid).columns
                }, 1fr)`,
                gridTemplateRows: `repeat(${(block as SanityGrid).rows}, 1fr)`,
              }}
              className="gap-5"
            >
              {(block as SanityGrid).posts.map((post) => (
                <PostCard
                  hideExtraInfo
                  hideAnimationOnHover
                  className=" shadow-none !hover:py-0 !max-h-[350px] !border-inherit"
                  linkClassName="grid !grid-cols-1"
                  post={post}
                  key={post._id}
                />
              ))}
            </ul>
          </div>
        );

      case "post":
        return <PostCard post={block as SanityPost} key={block._id} />;

      case "author": {
        const authorPosts = (block as any).authorPosts;
        const author = block as SanityAuthor;

        console.log(authorPosts);
        return (
          <div className="relative">
            <img
              className="brightness-60  object-cover object-center"
              src={author.imageUrl}
              alt={author.name + " image"}
            />
            <div className="absolute top-20 left-20 bg-white shadow-lg rounded-lg p-2">
              <h2>{author.name}</h2>
              <p className="italic text-xs">{author.occupation}</p>
              <p className="text-xs mt-2">
                {author.name} har skrevet {authorPosts.length} artikler
              </p>
            </div>
            <div className="absolute p-20 -bottom-10 w-full overflow-x-scroll bg-transparent">
              <div className="flex flex-row w-full overflow-x-scroll">
                {authorPosts?.map((post) => (
                  <PostCard
                    key={post._id + "authorposts"}
                    hideExtraInfo
                    hideAnimationOnHover
                    className="shadow-none hover:bg-primary hover:text-secondary !p-10 min-w-[600px] bg-transparent text-white !hover:py-0 !max-h-[350px] !border-inherit"
                    linkClassName="grid !grid-cols-1"
                    post={post}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      default:
        return <div>Unknown block type: {block._type}</div>;
    }
  });
}
