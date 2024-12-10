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
  return (
    <div className="mt-5">
      <h1 className="inline w-full text-xl font-bold border-white">
        Relaterte artikler
      </h1>
      <ul className="grid lg:grid-cols-1 grid-cols-1 gap-5 mt-5 ">
        {getRelatedPosts(relatedPosts).map((x, index) => {
          return (
            <li key={x._id}>
              <PostCard
                post={x}
                className={cn(
                  "hover:shadow-lg shadow-none !border-2 !border-inherit dark:hover:!border-secondary"
                )}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
