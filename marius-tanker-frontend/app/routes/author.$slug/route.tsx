import { PortableText } from "@portabletext/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PostCard from "~/routes/lib.client/postCard/PostCard";
import { SanityAuthor, SanityPost } from "~/types/sanity";
import { AUTHOR_BY_SLUG } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity.server";
import { useState } from "react";
import Suprise from "~/routes/lib.client/Suprise";
import StaticPostCard from "../lib.client/postCard/StaticPostCard";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const response = await client.fetch(AUTHOR_BY_SLUG, {
    slug: params.slug,
  });

  return response as SanityAuthor;
};

export default function Author() {
  const author = useLoaderData<typeof loader>();

  const [counter, setCounter] = useState(0);

  const components: any = {
    block: {
      normal: ({ children }) => {
        return <p className="text-xl leading-6">{children}</p>;
      },
    },
  };

  return (
    <>
      <Suprise counter={counter} />
      <div className="p-5 mt-[150px] lg:mt-[150px] m-auto lg:p-5 flex w-full lg:w-[60%] flex-col lg:flex-row gap-10">
        <img
          onClick={() => {
            setCounter(counter + 1);
          }}
          className="border-2 shadow-xl lg:h-[200px] rounded-full"
          src={author.imageUrl}
          alt={author.name}
        />
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-4xl font-bold">{author.name}</h1>
            <p className="text-lg">{author.occupation}</p>
          </div>
          <PortableText components={components} value={author.description} />
        </div>
      </div>
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-xl font-bold">Innlegg skrevet av {author.name}:</h2>
        <ul className="flex lg:p-10 mt-5 flex-col gap-5 ">
          {author.posts?.map((post: SanityPost) => {
            return (
              <StaticPostCard
                className="lg:w-[900px]"
                post={post}
                key={post._id}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
}
