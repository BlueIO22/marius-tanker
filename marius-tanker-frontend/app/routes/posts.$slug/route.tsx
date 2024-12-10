import {
  faCalendar,
  faCamera,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PortableText } from "@portabletext/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import dayjs from "dayjs";
import Explanation from "~/lib/explanation/Explanation";
import { supabase } from "~/service/supabase.server";
import { SanityPost, SanityTag } from "~/types/sanity";
import { POST_BY_SLUG, RELATED_POSTS_QUERY } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";
import { Comment, Like } from "~/types/tanker";
import { authenticator } from "~/service/auth.server";
import type { ActionArgs } from "@remix-run/node";
import CommentsSection from "~/lib/comments/CommentsSection";
import getDemoUser from "~/utils/tankerUtil";
import LikeSection from "~/lib/LikeSection";
import RelatedPosts from "~/lib/RelatedPosts";

export const action = async ({ request }: ActionArgs) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const userId = formData.get("userId");
      const postId = formData.get("postId");
      const reference = formData.get("reference");
      const text = formData.get("text");
      const root = formData.get("root");

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
        ref: reference,
        text: text,
        root: root,
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
        console.log("Error", response.error);
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

function iterateComment(comment: Comment, comments: Comment[]) {
  comment.comments = [];
  const commentsForThisComment = comments.filter(
    (x) => parseInt(x.root ?? "") === parseInt(comment.id)
  ) as Comment[];

  if (commentsForThisComment.length === 0) {
    return comment;
  }

  for (const commentForThisComment of commentsForThisComment) {
    const newComment = iterateComment(commentForThisComment, comments);
    if (newComment) {
      comment.comments?.push(newComment);
    }
  }

  return comment;
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const response = await client.fetch(POST_BY_SLUG, {
    slug: params.slug,
  });

  const url = new URL(request.url);
  const testUser = url.searchParams.get("testUser");

  const commentsResponse = await supabase
    .from("comments")
    .select("*, likes(*)")
    .eq("postId", response?._id);

  const relatedPosts = await client.fetch(RELATED_POSTS_QUERY, {
    postId: response?._id ?? "",
  });

  const relatedPostsData = [
    ...relatedPosts.postsByTag.map((x) => x as SanityPost),
    ...relatedPosts.postsByAuthor.map((x) => x as SanityPost),
    ...relatedPosts.latestPosts.map((x) => x as SanityPost),
  ];

  const postLikes = await supabase
    .from("likes")
    .select("*")
    .eq("postId", response?._id);

  const user =
    (await authenticator.isAuthenticated(request)) ??
    getDemoUser(testUser ?? "BlueIO22");

  const comments =
    commentsResponse?.data?.map((x) =>
      iterateComment(x, commentsResponse.data)
    ) ?? [];

  if (!response) {
    return null;
  }

  return {
    post: response as SanityPost,
    postLikes: postLikes.data?.map((x) => x as Like) ?? [],
    relatedPosts: relatedPostsData,
    comments: comments,
    user,
  };
};

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const action = useLoaderData<typeof action>();

  const post = data?.post;
  const comments: Comment[] = data?.comments ?? [];

  const user: any = data?.user;

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

  const relatedPosts = data.relatedPosts;

  return (
    <div className="w-full h-full lg:p-0">
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
              <p className="flex items-center">
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
      </div>
      <div className="mt-10">
        <h1 className="text-3xl">{post.title}</h1>
        <p className="text-xl mt-2"> - {post.subtitle}</p>
        <div className="mt-2">
          {post.author && (
            <Link
              to={"/author/" + post.author.slug}
              className="flex mb-5 w-[180px] cursor-pointer p-2 rounded-lg hover:underline flex-row gap-2 items-center"
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
        </div>
        <div className="mt-5">
          <PortableText
            components={postContentComponents}
            value={post.content}
          />
        </div>
        <LikeSection likes={data.postLikes} postId={post._id} user={user} />
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
        <CommentsSection
          comments={comments}
          action={action}
          post={post}
          user={user}
        />
        <RelatedPosts relatedPosts={relatedPosts} />
      </div>
    </div>
  );
}
