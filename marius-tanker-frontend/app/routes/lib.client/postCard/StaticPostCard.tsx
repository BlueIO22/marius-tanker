import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { useState } from "react";
import { SanityPost } from "~/types/sanity";

export default function StaticPostCard({ post }: { post: SanityPost }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Link
      to={`/posts/${post.slug}`}
      style={{
        transition: "all .5s",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex relative hover:shadow-xl cursor-pointer flex-col hover:bg-white hover:text-black"
    >
      <img
        className="h-[200px] lg:h-[300px] mb-2 object-cover object-center"
        src={post.imageUrl}
        alt=""
      />
      {isHovering && (
        <div className="p-2 lg:flex gap-2 items-center hidden drop-down absolute bg-white text-black shadow-xl rounded-lg top-4 left-4">
          <img
            src={post.author?.imageUrl}
            alt={post.author?.name + " profilbilde"}
            className="h-[34px] rounded-full w-[34px]"
          ></img>
          {post.author?.name}
        </div>
      )}

      <div className="p-2 flex gap-2 items-center lg:hidden drop-down absolute  bg-white text-black shadow-xl rounded-lg top-4 left-4">
        <img
          src={post.author?.imageUrl}
          alt={post.author?.name + " profilbilde"}
          className="h-[24px] rounded-full w-[24px]"
        ></img>
        {post.author?.name}
      </div>

      <div className="flex px-5 py-5 flex-col items-center">
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="text-gray-500">
          {dayjs(post._createdTime).format("DD.MM.YYYY HH:mm")}
        </p>
        <p className="italic mt-2">
          {post.excerpt?.length > 100
            ? post.excerpt.slice(0, 100) + "..."
            : post.excerpt}
        </p>
      </div>
    </Link>
  );
}
