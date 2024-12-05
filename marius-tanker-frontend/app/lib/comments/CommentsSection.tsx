import dayjs from "dayjs";
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
      <h2 className="font-bold text-lg">Kommentarer ({comments.length}):</h2>
      <p>Oppfør deg og være snill og grei, krever github innlogging</p>
      <div className="my-5">
        <CommentForm action={action} slug={post.slug} user={user} />
      </div>

      <div className="mt-5">
        {comments
          .filter((x) => x.root === null)
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
    </div>
  );
}
