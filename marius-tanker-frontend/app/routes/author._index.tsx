import { Link, useLoaderData } from "@remix-run/react";
import { SanityAuthor } from "~/types/sanity";
import { ALL_AUTHORS } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";

export const loader = async () => {
  const response = await client.fetch(ALL_AUTHORS);

  if (!response) return [];

  return response as SanityAuthor[];
};

export default function AuthorsPage() {
  const authors = useLoaderData<typeof loader>();

  return (
    <div className="mt-10">
      <ul>
        {authors.map((author) => {
          return (
            <Link
              key={author._id}
              to={"/author/" + author.slug}
              className="flex mb-5 w-[400px] border-2 cursor-pointer p-2  hover:bg-secondary hover:text-primary flex-row gap-2 items-center"
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
