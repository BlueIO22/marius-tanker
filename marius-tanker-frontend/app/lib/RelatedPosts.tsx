import { SanityPost } from "~/types/sanity";
import PostCard from "./postCard/PostCard";
import { cn } from "./utils";

function getRelatedPosts(relatedPostsData: SanityPost[]) {
  if (relatedPostsData.length < 3) {
    return relatedPostsData;
  }
  return relatedPostsData.splice(0, 3);
}

export default function RelatedPosts({
  relatedPosts,
}: {
  relatedPosts: SanityPost[];
}) {
  const posts = getRelatedPosts(relatedPosts);
  if (posts.length == 0) {
    return null;
  }
  return (
    <div className="my-10">
      <h1 className="inline w-full text-xl font-bold border-white">
        Relaterte artikler
      </h1>
      <p className="text-sm opacity-60">
        Her er noen artikler som kan være av interesse
      </p>
      <ul className="grid grid-cols-1 gap-5 mt-5 ">
        {posts.map((x) => {
          return (
            <PostCard
              key={x._id}
              post={x}
              className={cn(
                "hover:shadow-lg transition-all-[200ms] shadow-none !border-2 !border-inherit dark:hover:!border-secondary"
              )}
            />
          );
        })}
      </ul>
    </div>
  );
}
