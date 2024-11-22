import { Link } from "@remix-run/react";
// eslint-disable-next-line import/no-unresolved
import { SanityPost } from "~/types/sanity";
import { cn } from "../utils";
import styles from "./PostCard.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

export default function PostCard({
  post,
  className,
}: {
  post: SanityPost;
  className?: string;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Link
      to={"/posts/" + post.slug}
      className="z-0 hover:z-10"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchMove={() => setIsHovering(true)}
      onTouchCancel={() => setIsHovering(false)}
    >
      <li
        className={cn(
          "grid p-5 lg:grid-cols-2 relative hover:border-2 hover:border-secondary hover:py-10 group transition-all lg:flex-row flex-col lg:items-center lg:p-5 pb-5 gap-5 dark:border-2 dark:border-secondary shadow-lg bg-primary text-secondary cursor-pointer",
          className,
          styles.postCard
        )}
      >
        {isHovering && (
          <p className="absolute top-2 right-2">@{post.author?.name}</p>
        )}
        <div className="lg:w-[350px] lg:h-[200px] p-5">
          <img
            className="h-full w-full object-cover object-center"
            src={post.previewImageUrl}
            alt={post.title}
          />
        </div>
        <div className={cn("flex flex-col gap-2 transition-all")}>
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-xl">{post.subtitle}</p>
          {isHovering && (
            <div className={styles.contentContainer}>
              <p>
                {post.excerpt?.length > 100
                  ? post.excerpt.slice(0, 100) + "..."
                  : post.excerpt}
              </p>
            </div>
          )}
        </div>
      </li>
    </Link>
  );
}
