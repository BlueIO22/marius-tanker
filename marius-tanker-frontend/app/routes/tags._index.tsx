import { Link, useLoaderData } from "@remix-run/react";
import { SanityTag } from "~/types/sanity";
import { ALL_TAGS } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity.server";

export const loader = async () => {
  const response = await client.fetch(ALL_TAGS);
  return response as SanityTag[];
};

export default function TagsPage() {
  const data = useLoaderData<typeof loader>();

  const parentTags = data
    .filter((parentTag) => parentTag.parent == null)
    .map((parent) => {
      const children = data.filter((t) => t.parent?._id === parent._id);
      return {
        ...parent,
        childrenTags: children,
      };
    });

  return (
    <div className="lg:p-10 mt-5 ">
      <h1 className="text-3xl font-bold  underline">Tags:</h1>
      <ul className="flex flex-col gap-2 mt-5">
        {parentTags.map((parent: any) => {
          return (
            <li
              className={`text-2xl  ${
                parent.childrenTags.length > 0 ? "font-bold" : ""
              }`}
              key={parent._id}
            >
              <Link className=" hover:underline" to={"/tags/" + parent.slug}>
                {parent.title} ({parent.countOfPosts})
              </Link>
              {parent.childrenTags.length > 0 && (
                <ul className="ml-5 flex flex-col ">
                  {parent.childrenTags.map((childrenTag: SanityTag) => {
                    return (
                      <Link
                        key={childrenTag._id}
                        className="hover:bg-primary hover:text-secondary hover:underline font-normal"
                        to={"/tags/" + childrenTag.slug}
                      >
                        - {childrenTag.title} ({parent.countOfPosts})
                      </Link>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
