import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetcher } from "@remix-run/react";
import { Comment } from "~/types/tanker";
import "@fortawesome/fontawesome-svg-core/styles.css";

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

  if (comment.likes.find((x) => x.userId === user.displayName)) {
    return (
      <fetcher.Form
        action={"/commentLikes"}
        method="delete"
        onSubmit={(event) => {
          fetcher.submit(event.target as HTMLFormElement, {
            method: "DELETE",
          });
          event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={comment.id} />
        <input type="hidden" name="userId" value={user?.displayName} />
        <button
          type="submit"
          className="underline hover:font-bold transition-all"
        >
          <FontAwesomeIcon icon={faThumbsUp} />{" "}
          <span className="hidden lg:inline">{whoLikesThis} liker dette</span>
          <span className="lg:hidden">Du liker dette </span> ({likeCount})
        </button>
      </fetcher.Form>
    );
  }

  return (
    <fetcher.Form
      action={"/commentLikes"}
      method="patch"
      onSubmit={(event) => {
        fetcher.submit(event.target as HTMLFormElement, {
          method: "PATCH",
        });
        event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={comment.id} />
      <input type="hidden" name="userId" value={user?.displayName} />
      <button
        type="submit"
        className="underline hover:font-bold transition-all"
      >
        <FontAwesomeIcon className="mr-2" icon={faThumbsUp} />
        <span className="hidden lg:inline">
          {whoLikesThis} {likeCount > 0 ? "liker dette" : "Lik"}
        </span>
        <span className="lg:hidden">Lik </span> ({likeCount})
      </button>
    </fetcher.Form>
  );
}
