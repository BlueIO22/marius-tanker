import { SanityPost } from "~/types/sanity";
import PostCard from "./postCard/PostCard";
import { cn } from "./utils";
import StaticPostCard from "./postCard/StaticPostCard";
export default function RelatedPosts({
  relatedPosts,
}: {
  relatedPosts: SanityPost[];
}) {
  return (
    <div className="my-10">
      <h1 className="inline w-full text-xl font-bold border-white">
        Relaterte artikler
      </h1>
      <p className="text-sm opacity-60">
        Her er noen artikler som kan være av interesse
      </p>
      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5 ">
        {relatedPosts.map((x) => {
          return (
            <StaticPostCard
              imageClassName="!h-[200px] object-cover brightness-75"
              key={x._id}
              post={x}
            />
          );
        })}
      </ul>
    </div>
  );
}
