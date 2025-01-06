import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetcher } from "@remix-run/react";
import { Comment } from "~/types/tanker";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { cn } from "../utils";

export default function LikesContainer({
  user,
  comment,
  shouldComment,
}: {
  user: any;
  comment: Comment;
  shouldComment: boolean;
}) {
  const fetcher = useFetcher();
  const likeCount = comment.likes.length ?? 0;

  if (shouldComment) {
    return null;
  }

  const whoLikesThis =
    likeCount < 3
      ? comment.likes.map((x) => x.userId).join(", ")
      : comment.likes
          .map((x) => x.userId)
          .splice(0, 2)
          .join(", ") +
        " og " +
        (likeCount - 2) +
        " andre";

  const userLikesThis = comment.likes.find(
    (x) => x.userId === user?.displayName
  );

  if (user === null) {
    if (likeCount === 0) {
      return (
        <p>
          <FontAwesomeIcon icon={faThumbsUp} /> Ingen liker dette
        </p>
      );
    }
    return (
      <p>
        <FontAwesomeIcon icon={faThumbsUp} />{" "}
        <span className="hidden lg:inline">{whoLikesThis} liker dette</span>
        <span className="lg:hidden">Du liker dette </span> ({likeCount})
      </p>
    );
  }

  return (
    <fetcher.Form
      action={"/commentLikes"}
      method="delete"
      onSubmit={(event) => {
        fetcher.submit(event.target as HTMLFormElement, {
          method: userLikesThis ? "DELETE" : "PATCH",
        });
        event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={comment.id} />
      <input type="hidden" name="userId" value={user?.displayName} />
      <button type="submit" className="hover:font-bold transition-all">
        <span
          className={
            (cn(" stroke-black stroke-2"), userLikesThis ? "text-blue-400" : "")
          }
        >
          <FontAwesomeIcon icon={faThumbsUp} />{" "}
        </span>
        {likeCount > 0 && `(${likeCount})`}
      </button>
    </fetcher.Form>
  );
}
