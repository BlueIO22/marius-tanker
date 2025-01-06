import { Link, useLoaderData } from "@remix-run/react";
import { SanityAuthor } from "~/types/sanity";
import { ALL_AUTHORS } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity.server";

export const loader = async () => {
  const response = await client.fetch(ALL_AUTHORS);

  if (!response) return [];

  return response as SanityAuthor[];
};

export default function AuthorsPage() {
  const authors = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="inline w-full ml-5 mb-2 text-xl font-bold border-white">
        Forfattere
      </h1>
      <ul className="mt-2 ml-5">
        {authors.map((author) => {
          return (
            <Link
              key={author._id}
              to={"/author/" + author.slug}
              className="flex mb-2 lg:w-[400px] cursor-pointer p-2 hover:underline flex-row gap-2 items-center rounded-lg"
            >
              <img
                className="h-[64px] rounded-full"
                src={author.imageUrl}
                alt={author + " bilde"}
              />
              <div>
                <p>{author.name}</p>
                <p className="text-xs">{author.occupation}</p>
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
