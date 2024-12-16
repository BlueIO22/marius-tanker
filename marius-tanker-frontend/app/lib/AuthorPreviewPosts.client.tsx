import { useRef } from "react";
import { SanityPost } from "~/types/sanity";
import { useDraggable } from "react-use-draggable-scroll";

export default function AuthorPreviewPosts({
  authorPosts,
}: {
  authorPosts: SanityPost[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { events } = useDraggable(ref);

  if (ref == null) {
    return null;
  }

  return (
    <div
      ref={ref}
      {...events}
      className="flex gap-5 no-scrollbar p-2 bar flex-row w-full overflow-x-scroll"
    >
      {authorPosts?.map((post: SanityPost) => (
        <div
          key={post._id}
          style={{
            height: "200px",
            minWidth: "500px",
            backgroundSize: "cover",
            backgroundImage: `url(${post.imageUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="relative z-50 shadow-xl"
        >
          <div className="absolute top-5 left-5 bg-white p-2 rounded-lg">
            <h3 className="font-bold">{post.title}</h3>
            <p className="italic text-md">{post.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
