import { PortableText } from "@portabletext/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SanityPost } from "types/sanity";
import { POST_BY_SLUG } from "~/utils/sanity/queries";
import { client } from "~/utils/sanity/sanity";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const response = await client.fetch(POST_BY_SLUG, {
    slug: params.slug,
  });

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
    block: {
      normal: ({ children }: { children: any }) => {
        return <p className="mt-10">{children}</p>;
      },
    },
  };

  return (
    <div className="w-full h-full mt-10 ">
      <div>
        <img
          className="border-2 mb-5 max-h-[500px] w-full object-cover object-center"
          src={post.imageUrl}
          alt={post.title}
        />
      </div>
      <div className="p-5">
        <h1 className="text-3xl">{post.title}</h1>
        <p className="text-xl mt-2"> - {post.subtitle}</p>
        <div>
          <PortableText
            components={postContentComponents}
            value={post.content}
          />
        </div>
      </div>
    </div>
  );
}
