import { Link, useLoaderData } from "@remix-run/react";
import { SanityTag } from "~/types/sanity";
import { ALL_TAGS } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";

export const loader = async () => {
  const response = await client.fetch(ALL_TAGS);
  return response as SanityTag[];
};

export default function TagsPage() {
  const tags = useLoaderData<typeof loader>();

  return (
    <div className="lg:p-10 mt-5 ">
      <h1 className="text-3xl font-bold mb-5 underline">Tags:</h1>
      <ul className="flex flex-col">
        {tags.map((tag: SanityTag) => {
          return (
            <li className="text-2xl mb-5" key={tag._id}>
              <Link
                className=" hover:bg-primary hover:text-secondary hover:p-1"
                to={"/tags/" + tag.slug}
              >
                {tag.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
