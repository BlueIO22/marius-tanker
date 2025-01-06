"use client";

import { useRef } from "react";
import { SanityPost } from "~/types/sanity";
import { useDraggable } from "react-use-draggable-scroll";
import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

export default function AuthorPreviewPosts({
  authorPosts,
}: {
  authorPosts: SanityPost[];
}) {
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  if (typeof window === "undefined") {
    return null;
  }

  const { events } = useDraggable(ref, {
    applyRubberBandEffect: true,
  });

  if (ref == null) {
    return null;
  }

  return (
    <div
      {...events}
      ref={ref}
      className="flex gap-5 no-scrollbar p-2 bar flex-row w-full overflow-x-scroll"
    >
      {authorPosts?.map((post: SanityPost) => (
        <div
          key={post._id}
          style={{
            backgroundSize: "cover",
            backgroundImage: `url(${post.imageUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="relative rounded-lg z-50 shadow-xl min-w-[400px] h-[200px] lg:min-w-[500px]"
        >
          <motion.div
            initial={{ y: -100 }}
            whileInView={{ y: 0 }}
            className="absolute top-5 left-5 bg-white p-2 rounded-lg"
          >
            <h3 className="font-bold">{post.title}</h3>
            <p className="italic text-md mb-4">{post.subtitle}</p>
            <div className="flex justify-end">
              <Link
                className=" border-b-2 hover:border-2 hover:p-1 transition-all border-dashed border-secondary text-right"
                to={`/posts/${post.slug}`}
              >
                Les mer
              </Link>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
