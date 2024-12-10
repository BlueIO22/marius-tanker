import { Link } from "@remix-run/react";
// eslint-disable-next-line import/no-unresolved
import { SanityPost } from "~/types/sanity";
import { cn } from "../utils";
import styles from "./PostCard.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

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
          <p
            className={cn(
              "lg:absolute m-auto right-8 flex gap-2 items-center font-bold",
              hideExtraInfo ? "top-2 right-4" : "bottom-6"
            )}
          >
            <img
              className="h-[34px] w-[34px] rounded-full object-cover object-center"
              src={post.author?.imageUrl}
              alt={post.author?.name}
              loading="lazy"
            />{" "}
            <span>
              {post.author?.name}{" "}
              <span className=" font-normal text-xs block">
                <FontAwesomeIcon icon={faClock} />{" "}
                {post.estimatedReadingTime ?? 0}{" "}
                {(post.estimatedReadingTime ?? 0) > 1 ? "minutters" : "minutt"}{" "}
                lesing
              </span>
            </span>
          </p>
        )}
        {isHovering && (
          <ul
            className={cn(
              "fly-from-left m-auto top-6 left-8 flex gap-2 mb-2 lg:absolute",
              hideExtraInfo ? "top-2 left-4" : ""
            )}
          >
            {post.tags
              ?.map((tag) => (
                <li key={tag._id} className="p-1 italic border-b-1 font-bold">
                  {tag.title}
                </li>
              ))
              .splice(0, hideExtraInfo ? 2 : 3)}
          </ul>
        )}
        <div
          className={cn(
            "lg:w-[400px] lg:h-[200px] p-5",
            hideExtraInfo ? "lg:w-full" : ""
          )}
        >
          <img
            className="h-full w-full object-cover object-center"
            src={post.previewImageUrl}
            alt={post.title}
            loading="lazy"
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
