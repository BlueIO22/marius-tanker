import { Link } from "@remix-run/react";
import { SanityPost } from "~/types/sanity";

export default function PostCard({ post }: { post: SanityPost }) {
  return (
    <Link to={"/posts/" + post.slug}>
      <li className="flex lg:flex-row flex-col lg:items-center lg:p-5 pb-5 gap-5 border-dashed shadow-lg bg-primary hover:bg-black border-2 hover:bg-secondary hover:text-primary text-secondary cursor-pointer">
        <div className="">
          <img
            className="lg:w-[200px] h-[100px] w-[350px] object-cover object-center"
            src={post.previewImageUrl}
            alt={post.title}
          />
        </div>
        <div className="pl-5 pr-5 ">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="text-xl">{post.subtitle}</p>
        </div>
      </li>
    </Link>
  );
}
