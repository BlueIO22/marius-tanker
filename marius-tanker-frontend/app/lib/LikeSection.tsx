import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetcher } from "@remix-run/react";
import { Like } from "~/types/tanker";
import { cn } from "./utils";
import { useState } from "react";

export default function LikeSection({
  postId,
  user,
  likes,
}: {
  postId: string;
  user: any;
  likes: Like[];
}) {
  const [isHovering, setIsHovering] = useState(false);
  const fetcher = useFetcher();
  if (!user) {
    return null;
  }
  const hasUserLikedThis = likes.find((x) => x.userId === user.displayName);
  return (
    <div
      className="my-5"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className="text-tiny italic">
        Likte du denne artikkelen, legg igjen ein like
      </span>
      <fetcher.Form
        action={"/postLikes"}
        method="delete"
        onSubmit={(event) => {
          fetcher.submit(event.target as HTMLFormElement, {
            method: hasUserLikedThis ? "DELETE" : "PATCH",
          });
          event.preventDefault();
        }}
      >
        <input type="hidden" name="userId" value={user.displayName} />
        <input type="hidden" name="postId" value={postId} />
        <button
          type="submit"
          className={cn(
            "p-2 border-2 rounded-lg my-2 ",
            hasUserLikedThis
              ? "text-white bg-red-500 border-white"
              : "border-none"
          )}
        >
          <FontAwesomeIcon beat={isHovering} icon={faHeart} />{" "}
          {hasUserLikedThis
            ? likes.length > 1
              ? `Du liker denne artikkelen og ${likes.length - 1} andre`
              : "Du liker denne artikkelen"
            : "Lik denne artikkelen"}
        </button>
      </fetcher.Form>
    </div>
  );
}
