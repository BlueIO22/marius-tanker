import {
  faMessage,
  faThumbsUp,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Link, useFetcher, useSubmit } from "@remix-run/react";
import CommentForm from "./CommentForm";
import { Comment } from "~/types/tanker";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "../utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import LikesContainer from "./LikesContainer";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

function findReplyToComment(comment: Comment, comments: Comment[]) {
  return comments.find((x) => parseInt(x.id) === parseInt(comment.ref));
}

function getSubstringAndDotFromText(text: string) {
  return text.length > 50 ? text.substring(0, 50) + "..." : text;
}

export default function CommentEntry({
  comment,
  action,
  slug,
  user,
  replyTo,
}: {
  comment: Comment;
  action: any;
  slug: string;
  user: any;
  replyTo?: Comment;
}) {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const [shouldComment, setShouldComment] = useState(false);
  const comments = comment.comments ?? [];
  return (
    <div
      key={comment.id}
      className={cn(
        "w-full lg:w-full py-2 hover:border-secondary lg:px-2 ",
        comment?.root !== null
          ? "border-2 hover:border-inherit border-primary hover:shadow-lg my-5 p-5"
          : ""
      )}
    >
      <div>
        {replyTo && (
          <span className="text-tiny">
            <p className="text-tiny opacity-55 w-full break-words">
              {getSubstringAndDotFromText(
                "@" + replyTo?.userId + " - " + replyTo?.text
              )}
            </p>
          </span>
        )}
        <div
          className={cn(
            comment?.root === null
              ? "border-2 hover:shadow-lg p-5 border-black dark:border-white "
              : ""
          )}
        >
          <div className={cn("font-bold flex justify-between mt-2")}>
            <Link
              to={"https://github.com/" + comment.userId}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 underline"
            >
              <GitHubLogoIcon height={24} width={24} />
              <span>{comment.userId}</span>
            </Link>
            <div className="flex gap-2">
              {dayjs(comment.created_at)
                .tz("Europe/Oslo")
                .format("DD.MM.YYYY HH:MM")}
              {user && comment.userId === user.displayName && (
                <Form action={action} method="delete" navigate={false}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input
                    type="hidden"
                    name="userId"
                    value={user?.displayName}
                  />
                  <button type="submit">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </Form>
              )}
            </div>
          </div>
          <p className="my-2 max-w-full break-words">{comment.text}</p>
          <div className="flex items-center gap-5 px-2">
            <LikesContainer
              user={user}
              comment={comment}
              shouldComment={shouldComment}
            />
            {shouldComment ? (
              <div className="w-full">
                <CommentForm
                  action={action}
                  reference={comment.id}
                  slug={slug}
                  user={user}
                  root={comment.root ?? comment.id}
                  onSend={() => setShouldComment(false)}
                />
              </div>
            ) : (
              <Button
                className={cn(
                  "text-secondary p-0  transition-all underline hover:font-bold "
                )}
                variant="link"
                onClick={() => setShouldComment(true)}
              >
                <FontAwesomeIcon icon={faMessage} />{" "}
                <span>Kommenter på dette</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      {comment.comments && comment.comments.length > 0 && (
        <h2 className="text-tiny  p-2 my-2 border-white">
          Kommentarer ({comments.length}):
        </h2>
      )}

      {comment.ref === null && comments.length > 0 && (
        <div className="pl-2">
          <div className="mb-2">
            {comments
              .sort((prev, curr) => {
                return prev.created_at > curr.created_at ? 1 : -1;
              })
              .map((x) => {
                return (
                  <CommentEntry
                    key={x.id}
                    comment={x}
                    action={action}
                    slug={slug}
                    user={user}
                    replyTo={findReplyToComment(x, comments) ?? replyTo}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
