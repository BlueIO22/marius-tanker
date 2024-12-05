import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";

export default function CommentForm({
  user,
  action,
  slug,
  reference,
  root,
  onSend,
}: {
  user: any;
  action: any;
  slug: string;
  reference?: string;
  root?: string;
  onSend?: () => void;
}) {
  const [text, setText] = useState("");

  const submit = useSubmit();
  if (!user) {
    return (
      <Form method="post" action={`/auth/github?redirectUrl=/posts/${slug}`}>
        <button className="flex underline mt-2 gap-2 items-center">
          <GitHubLogoIcon /> Logg inn for å kommentere
        </button>
      </Form>
    );
  }
  return (
    <div className={reference ? "mt-5" : ""}>
      {!reference && <h2>Vil du kommentere og mene noe spesielt?</h2>}
      <p>Du kommenterer som @{user.displayName} </p>
      <Form
        navigate={false}
        method="post"
        action={action}
        onSubmit={(event) => {
          submit(event.target as HTMLFormElement);
          onSend && onSend();

          event.preventDefault();
          setText("");
        }}
        className="flex items-center gap-2 w-full mt-2"
      >
        <input type="hidden" name="userId" value={user?.displayName} />
        <input type="hidden" name="postId" value={slug} />
        {root && <input type="hidden" name="root" value={root} />}
        {reference && (
          <input type="hidden" name="reference" value={reference} />
        )}
        <textarea
          onChange={(e) => setText(e.target.value)}
          name="text"
          value={text}
          className="border-2 w-full border-secondary p-2  rounded-lg text-secondary bg-primary h-[50px]"
          placeholder="Hva tenker du?..."
        />
        <button
          type="submit"
          className="bg-secondary text-primary p-2 rounded-lg"
        >
          Send
        </button>
      </Form>
    </div>
  );
}
