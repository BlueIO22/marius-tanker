import { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import PostCard from "~/lib/postCard/PostCard";
import { SanityPost, SanityTag } from "~/types/sanity";
import { SEARCH_QUERY } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";
import SyncLoader from "react-spinners/SyncLoader";

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
  const { state } = useNavigation();

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
        onKeyUp={(event) => {
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
        className="rounded-xl focus:shadow-lg transition-all border-2 border-dashed w-full p-8 lg:text-2xl text-[16px]"
      />
      {tags && (
        <div className="mt-5 flex flex-row lg:gap-5 gap-2 overflow-x-auto">
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
                } hover:bg-secondary rounded-lg hover:text-primary cursor-pointer`}
              >
                {tag.title}
              </div>
            );
          })}
        </div>
      )}

      {state === "loading" && <SyncLoader className="p-10" />}

      {searchParams.get("q") && (
        <h2 className="ml-2 font-bold mt-5">
          Viser søkeresultat for {searchParams.get("q")} ({posts.length}){" "}
        </h2>
      )}

      {posts?.length > 0 && state != "loading" && (
        <ul className="flex lg:p-10 mt-5 flex-col gap-5">
          {posts.map((post: SanityPost) => {
            return <PostCard post={post} key={post._id} />;
          })}
        </ul>
      )}
    </div>
  );
}
