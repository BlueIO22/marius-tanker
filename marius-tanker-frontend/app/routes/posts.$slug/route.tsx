import {
  faCalendar,
  faCamera,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PortableText } from "@portabletext/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import Explanation from "~/lib/explanation/Explanation";
import { SanityPost, SanityTag } from "~/types/sanity";
import { POST_BY_SLUG } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const response = await client.fetch(POST_BY_SLUG, {
    slug: params.slug,
  });

  console.log(response);

  if (!response) {
    return null;
  }

  return response as SanityPost;
};

export default function Post() {
  const post = useLoaderData<typeof loader>();

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
          <div className="mt-10 flex flex-col gap-5">
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
      </div>
    </div>
  );
}
