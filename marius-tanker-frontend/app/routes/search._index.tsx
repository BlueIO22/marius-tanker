import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import PostCard from "~/lib/postCard/PostCard";
import { SanityPost, SanityTag } from "~/types/sanity";
import { SEARCH_QUERY } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("q");
  const tags = url.searchParams.get("t")
    ? url.searchParams.get("t")?.split(",")
    : null;

  const response = await client.fetch(SEARCH_QUERY, {
    search: search,
    tags: tags?.length === 0 ? undefined : tags,
  });

  return {
    posts: (response?.posts as SanityPost[]) ?? [],
    tags: (response?.tags as SanityTag[]) ?? [],
  };
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { posts, tags } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [selectedTags, setSelectedTags] = useState(
    searchParams.get("t") ? searchParams.get("t")?.split(",") ?? [] : []
  );

  useEffect(() => {
    navigate({
      pathname: "/search",
      search:
        "?q=" +
        value +
        (selectedTags.length > 0 ? "&t=" + selectedTags?.join(",") : ""),
    });
  }, [selectedTags]);

  return (
    <div className="mt-10">
      <Input
        autoFocus
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            navigate({
              pathname: "/search",
              search:
                "?q=" +
                value +
                (selectedTags.length > 0
                  ? "&t=" + selectedTags?.join(",")
                  : ""),
            });
          }
        }}
        placeholder="Søk etter tittel, tags eller forfatter"
        className="rounded-xl border-2 border-dashed w-full p-8 text-2xl "
      />
      {tags && (
        <div className="mt-5 flex lg:flex-row flex-col gap-5">
          {tags.map((tag: SanityTag) => {
            return (
              <div
                key={tag._id}
                role="presentation"
                onClick={() => {
                  if (!selectedTags?.includes(tag.title)) {
                    setSelectedTags([...new Set(selectedTags), tag.title]);
                  } else {
                    setSelectedTags(selectedTags.filter((x) => x != tag.title));
                  }
                }}
                className={`p-2 ${
                  selectedTags?.includes(tag.title)
                    ? "bg-secondary text-primary"
                    : ""
                } hover:bg-secondary rounded-full hover:text-primary cursor-pointer`}
              >
                {tag.title}
              </div>
            );
          })}
        </div>
      )}
      {posts?.length > 0 && (
        <ul className="flex lg:p-10 mt-5 flex-col gap-5">
          {posts.map((post: SanityPost) => {
            return <PostCard post={post} key={post._id} />;
          })}
        </ul>
      )}
    </div>
  );
}
