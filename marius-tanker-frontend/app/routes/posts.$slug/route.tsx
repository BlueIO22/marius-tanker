import {
  faCalendar,
  faCamera,
  faRobot,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PortableText } from "@portabletext/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import dayjs from "dayjs";
import Explanation from "~/lib/explanation/Explanation";
import { supabase } from "~/service/supabase.server";
import { SanityPost, SanityTag } from "~/types/sanity";
import { POST_BY_SLUG } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";
import { Comment } from "~/types/tanker";
import { authenticator } from "~/service/auth.server";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { ActionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionArgs) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const userId = formData.get("userId");
      const postId = formData.get("postId");
      const text = formData.get("text");

      if (!userId || !postId || !text) {
        return new Response("", {
          status: 400,
          statusText: "Bad Request",
        });
      }

      const response = await supabase.from("comments").upsert({
        userId: userId,
        postId: postId,
        created_at: dayjs().toISOString(),
        text: text,
      });

      if (response.error) {
        return new Response("", {
          status: 500,
          statusText: "Internal Server Error",
        });
      }

      return new Response("", {
        status: 200,
      });
    }
    case "DELETE": {
      const formData = await request.formData();
      const id = formData.get("id");
      const userId = formData.get("userId");

      if (!id || !userId) {
        return new Response("", {
          status: 400,
          statusText: "Bad Request",
        });
      }

      const response = await supabase
        .from("comments")
        .delete()
        .eq("id", id)
        .eq("userId", userId);

      if (response.error) {
        return new Response("", {
          status: 500,
          statusText: "Internal Server Error",
        });
      }

      return new Response("", {
        status: 200,
      });
    }
    default:
      return new Response("", {
        status: 405,
        statusText: "Method Not Allowed",
      });
  }
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const response = await client.fetch(POST_BY_SLUG, {
    slug: params.slug,
  });
  const commentsResponse = await supabase
    .from("comments")
    .select("*")
    .eq("postId", params.slug);

  const user = await authenticator.isAuthenticated(request);

  const comments = commentsResponse?.data?.map((x) => x as Comment) ?? [];

  if (!response) {
    return null;
  }

  return { post: response as SanityPost, comments: comments, user };
};

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const action = useLoaderData<typeof action>();
  const submit = useSubmit();

  const post = data?.post;
  const comments: Comment[] = data?.comments ?? [];
  const user: any = data?.user;

  const [text, setText] = useState("");

  if (!post) {
    return <h1>Fant ikke innlegget</h1>;
  }

  const postContentComponents: any = {
    listItem: {
      number: ({ children }: { children: any }) => (
        <li className="mt-5"> - {children}</li>
      ),
    },
    marks: {
      explanation: ({ children, value }: { children: any; value: any }) => {
        return <Explanation explanation={value}>{children}</Explanation>;
      },
    },
    block: {
      normal: ({ children }: { children: any }) => {
        return <p className="mt-10 text-lg leading-8">{children}</p>;
      },
    },
  };

  const hasImageCrediting =
    post.imageCreditLine ||
    (post.creditLineFromUnsplash?.url && post.creditLineFromUnsplash?.line);

  const isUnsplash = !post.imageCreditLine
    ? post.creditLineFromUnsplash?.line && post.creditLineFromUnsplash?.url
    : false;

  return (
    <div className="w-full h-full mt-10 ">
      <div>
        <img
          className="border-2 mb-2 max-h-[500px] w-full object-cover object-center"
          src={post.imageUrl}
          alt={post.title}
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-between">
        <>
          <div className="flex flex-col lg:flex-row gap-5 order-2 lg:order-1">
            <p>
              <FontAwesomeIcon className="mr-2" icon={faCalendar} />
              {dayjs(post._createdTime).format("DD.MM.YYYY hh:mm")}
            </p>
            {post.isWrittenByAI && (
              <p>
                <FontAwesomeIcon className="mr-2" icon={faRobot} />
                Denne artikkelen har innhold generert av KI
              </p>
            )}
          </div>
          {hasImageCrediting && (
            <div className="flex flex-row order-1 lg:order-2">
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
      </div>
      <div className="mt-10">
        {post.author && (
          <Link
            to={"/author/" + post.author.slug}
            className="flex mb-5 w-[180px] cursor-pointer p-2 rounded-full hover:bg-secondary hover:text-primary flex-row gap-2 items-center"
          >
            <img
              className="h-[32px] rounded-full"
              src={post.author.imageUrl}
              alt={post.author + " bilde"}
            />
            <div>
              <p>{post.author.name}</p>
              <p className="text-xs">{post.author.occupation}</p>
            </div>
          </Link>
        )}
        <h1 className="text-3xl">{post.title}</h1>
        <p className="text-xl mt-2"> - {post.subtitle}</p>

        <div className="mt-5">
          <PortableText
            components={postContentComponents}
            value={post.content}
          />
        </div>

        {post.tags && (
          <div className="mt-10 flex flex-col gap-5 mb-10">
            <p>Tags:</p>
            <div>
              {post.tags.map((tag: SanityTag) => {
                return (
                  <Link
                    key={tag._id}
                    style={{
                      transition: "all 1s linear",
                    }}
                    className="border-2 cursor-pointer hover:border-dashed p-2 mr-5"
                    to={"/tags/" + tag.slug}
                  >
                    {tag.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {comments.length > 0 && (
          <div className="p-2 flex flex-col gap-2">
            <h2 className="">Kommentarer ({comments.length}):</h2>
            <div className="mt-5 border-b-2 border-b-secondary mb-5">
              {comments.map((comment: Comment) => {
                return (
                  <div
                    key={comment.id}
                    className="border-t-2 py-2 border-secondary px-2"
                  >
                    <p className="font-bold flex justify-between">
                      <span>@{comment.userId}</span>
                      <span className="flex gap-2">
                        {dayjs(comment.created_at).format("DD.MM.YYYY hh:mm")}
                        {user && comment.userId === user.displayName && (
                          <Form
                            action={action}
                            method="delete"
                            navigate={false}
                          >
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
                      </span>
                    </p>
                    <p>{comment.text}</p>
                  </div>
                );
              })}
            </div>
            {user ? (
              <div>
                <h2>Vil du kommentere og mene noe spesielt?</h2>
                <Form
                  navigate={false}
                  method="post"
                  action={action}
                  onSubmit={(event) => {
                    submit(event.target as HTMLFormElement);

                    event.preventDefault();
                    setText("");
                  }}
                  className="flex items-center gap-2 w-full mt-5"
                >
                  <input
                    type="hidden"
                    name="userId"
                    value={user?.displayName}
                  />
                  <input type="hidden" name="postId" value={post?.slug} />
                  <textarea
                    onChange={(e) => setText(e.target.value)}
                    name="text"
                    value={text}
                    className="border-2 border-secondary p-2 w-[400px] rounded-lg text-secondary bg-primary h-full"
                    placeholder="En mening..."
                  />
                  <button
                    type="submit"
                    className="bg-secondary text-primary p-2 rounded-lg"
                  >
                    Send
                  </button>
                </Form>
              </div>
            ) : (
              <Form
                method="post"
                action={`/auth/github?redirectUrl=/posts/${post.slug}`}
              >
                <button className="flex underline mt-2 gap-2 items-center">
                  <GitHubLogoIcon /> Logg inn for å kommentere
                </button>
              </Form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
