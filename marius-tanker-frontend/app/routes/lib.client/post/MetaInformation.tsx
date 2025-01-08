import {
  faCalendar,
  faCamera,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { SanityPost } from "~/types/sanity";

export default function MetaInformation({ post }: { post: SanityPost }) {
  const hasImageCrediting =
    post.imageCreditLine ||
    (post.creditLineFromUnsplash?.url && post.creditLineFromUnsplash?.line);

  const isUnsplash = !post.imageCreditLine
    ? post.creditLineFromUnsplash?.line && post.creditLineFromUnsplash?.url
    : false;

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:gap-5 order-2 gap-2 lg:order-1 ">
        <p>
          <FontAwesomeIcon className="mr-2" icon={faCalendar} />
          {dayjs(post._createdTime).format("DD.MM.YYYY hh:mm")}
        </p>
        {post.isWrittenByAI && (
          <p className="flex lg:hidden items-center">
            <FontAwesomeIcon className="mr-2" icon={faRobot} />
            <span>Denne artikkelen har innhold generert av KI</span>
          </p>
        )}
      </div>

      {hasImageCrediting && (
        <div className="flex flex-row order-1 lg:order-2 items-center">
          <FontAwesomeIcon icon={faCamera} className="mr-2 " />
          {isUnsplash ? (
            <Link
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
              to={post.creditLineFromUnsplash?.url ?? ""}
            >
              {post.creditLineFromUnsplash?.line}
            </Link>
          ) : (
            <p>{post.imageCreditLine}</p>
          )}
        </div>
      )}
    </>
  );
}
