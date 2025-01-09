import {
  faBaseball,
  faBullhorn,
  faBullseye,
  faCalendar,
  faCamera,
  faInfo,
  faInfoCircle,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PortableText } from "@portabletext/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import dayjs from "dayjs";
import Explanation from "~/routes/lib.client/explanation/Explanation";
import { SanityPost, SanityTag } from "~/types/sanity";
import { POST_BY_SLUG, RELATED_POSTS_QUERY } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity.server";
import { Comment, Like } from "~/types/tanker";
import { authenticator } from "~/service/auth.server";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import CommentsSection from "~/routes/lib.client/comments/CommentsSection";
import getDemoUser from "~/utils/tankerUtil";
import RelatedPosts from "~/routes/lib.client/RelatedPosts";
import PostContentImage from "~/routes/lib.client/PostContentImage";
import { Suspense, useEffect, useState } from "react";
import MetaInformation from "../lib.client/post/MetaInformation";
import TldrComponent from "../lib.client/post/TldrComponent";

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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = await client.fetch(POST_BY_SLUG, {
    slug: params.slug,
  });

  const isCommentsEnabled = process.env.IS_COMMENTS_ENABLED === "true";

  const url = new URL(request.url);
  const testUser = url.searchParams.get("testUser");

  const user =
    (await authenticator.isAuthenticated(request)) ??
    getDemoUser(testUser ?? "BlueIO22");

  return {
    post: response as SanityPost,
    user,
    isCommentsEnabled,
  };
}

function getRelatedPosts(post: SanityPost) {
  const relatedPostsList: any[] = [];
  const relatedByTag = post?.relatedPosts?.postsByTag ?? [];
  const relatedByAuthor = post?.relatedPosts?.postsByAuthor ?? [];
  const latestPosts = post?.relatedPosts?.latestPosts ?? [];

  relatedByTag.forEach((x) => {
    relatedPostsList.push(x);
  });

  relatedByAuthor.forEach((x) => {
    if (!relatedPostsList.some((y) => y._id == x._id)) {
      relatedPostsList.push(x);
    }
  });

  latestPosts.forEach((x) => {
    if (!relatedPostsList.some((y) => y._id == x._id)) {
      relatedPostsList.push(x);
    }
  });

  return relatedPostsList.length > 2
    ? relatedPostsList.splice(0, 3)
    : relatedPostsList;
}

export default function Post() {
  const data = useLoaderData<typeof loader>();

  const post = data?.post;
  const comments: Comment[] = data?.comments ?? [];
  const user: any = data?.user;

  const [relatedPosts, setRelatedPosts] = useState<SanityPost[]>([]);

  useEffect(() => {
    setRelatedPosts(getRelatedPosts(post));
  }, [post]);

  if (!post) {
    return <h1>Fant ikke innlegget</h1>;
  }

  const postContentComponents: any = {
    list: {
      bullet: ({ children }: { children: any }) => {
        return <ul className="ml-5">{children}</ul>;
      },
    },
    listItem: {
      number: ({ children, index }: { children: any; index: number }) => (
        <li>
          {" "}
          {index + 1}. {children}
        </li>
      ),
      bullet: ({ children }: { children: any }) => (
        <p className=" my-2">
          <FontAwesomeIcon icon={faInfoCircle} /> {children}
        </p>
      ),
    },
    types: {
      imageObject: ({ children, value }: { children: any; value: any }) => {
        return <PostContentImage value={value} />;
      },
    },
    marks: {
      explanation: ({ children, value }: { children: any; value: any }) => {
        return <Explanation explanation={value}>{children}</Explanation>;
      },
    },
    block: {
      blockquote: ({ children }: { children: any }) => {
        return (
          <blockquote className="mt-10 border-l-4 pl-5 italic">
            {children}
          </blockquote>
        );
      },
      h2: ({ children }: { children: any }) => {
        return <h2 className="text-2xl font-bold">{children}</h2>;
      },
      h3: ({ children }: { children: any }) => {
        return <h3 className="text-2xl font-bold">{children}</h3>;
      },
      normal: ({ children }: { children: any }) => {
        return <p className="mt-10 text-lg leading-8">{children}</p>;
      },
    },
  };
  return (
    <div className="w-full h-full lg:p-0 mt-[150px] lg:mt-0">
      <div className="mb-5 relative z-10 lg:shadow-xl">
        <div className="lg:absolute z-10 lg:shadow-lg dark:border-none jump-up lg:border-2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-bottom-[220px] p-10 flex flex-col items-center justify-center w-full lg:w-[600px] lg:bg-white dark:lg:bg-transparent backdrop-blur-3xl  dark:lg:text-white text-black dark:text-white ">
          <h1 className="text-3xl">{post.title}</h1>
          <p className="text-xl mt-2"> - {post.subtitle}</p>
          <div className="hidden lg:flex mt-5 pl-2 lg:pl-0 flex-col lg:flex-row lg:justify-between gap-5 lg:gap-10 ">
            <MetaInformation post={post} />
          </div>

          {post.isWrittenByAI && (
            <div className="hidden lg:block text-center my-5">
              <p>
                <FontAwesomeIcon className="mr-2" icon={faRobot} />
                <span>Denne artikkelen har innhold generert av KI</span>
              </p>
            </div>
          )}

          <div className="mt-2 ">
            {post.author && (
              <Link
                to={"/author/" + post.author.slug}
                className="flex mt-5 mb-5 w-[180px] cursor-pointer p-2 rounded-lg hover:underline flex-row gap-2 items-center"
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
        </div>

        <div
          className="w-full hidden lg:block h-[600px] lg:h-[1000px] bg-center"
          style={{
            backgroundImage: `url(${post.imageUrl}?h=1200&w=1200&fit=crop)`,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
          }}
        ></div>

        <img
          className="border-2 lg:hidden lg:max-h-[600px] max-h-[250px] w-full object-cover object-center"
          src={post.imageUrl}
          alt={post.title}
        />
        <div className="lg:hidden m-5 flex flex-col gap-2">
          <MetaInformation post={post} />
        </div>
      </div>
      <div className="lg:max-w-[1000px] m-auto mt-10">
        <div className="mt-10 px-2 lg:pl-0">
          <div className="mt-2 lg:hidden">
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
          <div className="lg:mt-[150px] text-xl italic ">{post.excerpt}</div>
          <div className=" mt-10">
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
          <RelatedPosts relatedPosts={relatedPosts} />
        </div>
      </div>
      <TldrComponent tldr={post.tldr} />
    </div>
  );
}
