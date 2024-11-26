import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import groq from "groq";
import { authenticator } from "~/service/auth.server";
import { supabase } from "~/service/supabase.server";
import { client } from "~/utils/sanity/sanity";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user: any = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const posts: any[] = [];

  const comments = await supabase
    .from("comments")
    .select("*")
    .eq("userId", user?.displayName);

  for (const index in comments.data) {
    const comment = comments.data[index];

    const response = await client.fetch(
      groq`*[_type=="post" && slug.current == $id][0] {_id, "slug": slug.current, title, subtitle, "imageUrl": image.asset->url + "?h=300&w=300&fit=crop"}`,
      {
        id: comment.postId,
      }
    );
    if (posts.find((x) => x._id === response._id)) {
      continue;
    }
    posts.push(response);
  }

  return { user, comments: comments.data, posts: posts };
};

export default function AuthorsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Hei, {data.user?.name.givenName} her er dine kommentarer</h1>
      <div className="my-5 ">
        {data.posts.map((x) => {
          return (
            <div
              key={x._id}
              className={
                "p-5 my-5 border-2 border-primary shadow-lg p-5 hover:border-secondary tranistion-all"
              }
            >
              <div className="flex gap-5 mb-5 border-b-2 pb-5">
                <img
                  src={x.imageUrl}
                  alt={x.title}
                  className="h-[64px] w-[64px] object-cover rounded-lg"
                />
                <div>
                  <Link to={"/posts/" + x.slug}>
                    <h2 className="italic font-bold text-lg">{x.title}</h2>
                  </Link>
                  <p className="text-normal">{x.subtitle}</p>
                </div>
              </div>
              <h2 className="mt-2 italic text-normal">
                Mine kommentarer (
                {data.comments?.filter((y) => y.postId === x.slug).length})
              </h2>
              <ul className="mt-2 ">
                {data.comments
                  ?.filter((y) => y.postId === x.slug)
                  .map((y) => {
                    return (
                      <li key={y.id} className="border-b-2 py-2">
                        <p className="flex gap-2 justify-between">
                          <span className="overflow-auto max-h-[200px]">
                            {y.text}
                          </span>
                          <span className="flex gap-2">
                            <FontAwesomeIcon icon={faClock} />
                            {dayjs(y.created_at).format("DD.MM.YYYY hh:mm")}
                          </span>
                        </p>
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
