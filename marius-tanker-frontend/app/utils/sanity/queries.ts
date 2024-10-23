import groq from "groq";

const POST_QUERY = `
        ...,
        "imageUrl": image.asset->url,
        "slug": slug.current,
        "previewImageUrl": image.asset->url + "?h=600&w=600",
        author->{
            ...,
            "slug": slug.current,
            "imageUrl": image.asset->url + "?h=300&w=300&fit=crop"
        }
`;

export const LATEST_POSTS = groq`
    *[_type=="post"] | order(_createdAt desc) [0..10] {
        ${POST_QUERY}
    }
`;

export const POST_BY_SLUG = groq`
    *[_type=="post" && slug.current==$slug] [0] {
        ${POST_QUERY}
    }
`;
