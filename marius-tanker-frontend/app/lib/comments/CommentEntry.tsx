import {
  faComment,
  faMessage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Link } from "@remix-run/react";
import CommentForm from "./CommentForm";
import { Comment } from "~/types/tanker";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "../utils";

export default function CommentEntry({
  comment,
  action,
  slug,
  user,
}: {
  comment: Comment;
  action: any;
  slug: string;
  user: any;
}) {
  const [shouldComment, setShouldComment] = useState(false);
  const comments = comment.comments ?? [];

  return (
    <div key={comment.id} className={cn("py-2 border-secondary px-2 ")}>
      <p className="font-bold flex justify-between">
        <span className="font-normal">@{comment.userId}</span>
        <span className="flex gap-2">
          {dayjs(comment.created_at).format("DD.MM.YYYY hh:mm")}
          {user && comment.userId === user.displayName && (
            <Form action={action} method="delete" navigate={false}>
              <input type="hidden" name="id" value={comment.id} />
              <input type="hidden" name="userId" value={user?.displayName} />
              <button type="submit">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </Form>
          )}
        </span>
      </p>
      <p>{comment.text}</p>
      {comments.length > 0 && (
        <div className="pl-2">
          <h2 className="font-bold text-tiny italic p-2 border-white">
            _({comments.length})_
          </h2>
          <div className="mb-2">
            {comments.map((x) => {
              return (
                <CommentEntry
                  key={x.id}
                  comment={x}
                  action={action}
                  slug={slug}
                  user={user}
                />
              );
            })}
          </div>
        </div>
      )}
      {shouldComment ? (
        <CommentForm
          action={action}
          reference={comment.id}
          slug={slug}
          user={user}
          onSend={() => setShouldComment(false)}
        />
      ) : (
        <Button
          className={cn("text-secondary p-0  transition-all underline")}
          variant="link"
          onClick={() => setShouldComment(true)}
        >
          <FontAwesomeIcon icon={faMessage} /> <span>Kommenter på dette</span>
        </Button>
      )}
    </div>
  );
}
