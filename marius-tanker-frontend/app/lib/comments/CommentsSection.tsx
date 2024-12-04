import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Form, useSubmit } from "@remix-run/react";
import dayjs from "dayjs";
import { useState } from "react";
import { SanityPost } from "~/types/sanity";
import { Comment } from "~/types/tanker";
import CommentForm from "./CommentForm";
import CommentEntry from "./CommentEntry";

export default function CommentsSection({
  comments,
  action,
  post,
  user,
}: {
  comments: Comment[];
  action: any;
  post: SanityPost;
  user: any;
}) {
  return (
    <div className="p-2 flex flex-col gap-2">
      <h2 className="">Kommentarer ({comments.length}):</h2>
      <div className="mt-5 border-b-2 border-b-secondary mb-5">
        {comments
          .filter((x) => x.ref === null)
          .map((comment: Comment) => {
            return (
              <CommentEntry
                key={comment.id}
                slug={post.slug}
                user={user}
                action={action}
                comment={comment}
              />
            );
          })}
      </div>
      <CommentForm action={action} slug={post.slug} user={user} />
    </div>
  );
}
