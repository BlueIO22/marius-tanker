import { Link } from "@remix-run/react";
// eslint-disable-next-line import/no-unresolved
import { SanityPost } from "~/types/sanity";
import { cn } from "../utils";
import styles from "./PostCard.module.css";
import { useState } from "react";
import dayjs from "dayjs";

export default function PostCard({
  post,
  className,
  hideExtraInfo,
}: {
  post: SanityPost;
  className?: string;
  hideExtraInfo?: boolean;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const isNewArticle = dayjs(post._createdTime).isAfter(
    dayjs().subtract(7, "day")
  );

  return (
    <Link
      to={"/posts/" + post.slug}
      className={cn("z-0 hover:z-10", styles.postCard)}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchMove={() => setIsHovering(true)}
      onTouchCancel={() => setIsHovering(false)}
      onFocusCapture={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
      tabIndex={0}
    >
      <li
        className={cn(
          "grid p-2 lg:grid-cols-2 relative hover:border-2 focus:border-secondary focus:border-2 hover:border-secondary hover:py-10 group transition-all lg:flex-row flex-col lg:items-center lg:p-5 pb-5 gap-5 dark:border-2 dark:border-secondary shadow-lg bg-primary text-secondary cursor-pointer",
          className
        )}
      >
        {isNewArticle && hideExtraInfo && (
          <div className="p-2 group-hover:hidden absolute top-2 lg:dark:bg-transparent lg:dark:border-dashed border-2 text-primary lg:dark:text-secondary left-2 bg-secondary w-fit shadow-lg rounded-lg">
            <p>Nyhet</p>
          </div>
        )}
        {isHovering && (
          <p className="absolute top-2 right-2">@{post.author?.name}</p>
        )}
        <div
          className={cn(
            "lg:w-[350px] lg:h-[200px] p-5",
            hideExtraInfo ? "lg:w-full" : ""
          )}
        >
          <img
            className="h-full w-full object-cover object-center"
            src={post.previewImageUrl}
            alt={post.title}
          />
        </div>
        <div className={cn("flex flex-col gap-2 transition-all")}>
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-xl">{post.subtitle}</p>
          {isHovering && !hideExtraInfo && (
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
