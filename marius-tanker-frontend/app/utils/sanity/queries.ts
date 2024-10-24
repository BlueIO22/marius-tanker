import groq from "groq";

const TAG_QUERY = `
            ...,
            "slug": slug.current,
            parent->{
                ...,
                "slug": slug.current
            }
`;

const POST_QUERY = `
        ...,
        "imageUrl": image.asset->url,
        "slug": slug.current,
        "previewImageUrl": image.asset->url + "?h=600&w=600",
        tags[]->{
            ${TAG_QUERY}
        }, 
        imageCreditLine,
        "creditLineFromUnsplash": {
            "url": image.asset->source.url,
            "line":  image.asset->creditLine
        },
        author->{
            ...,
            "slug": slug.current,
            "imageUrl": image.asset->url + "?h=300&w=300&fit=crop"
        }
`;

const AUTHOR_QUERY = `
    ...,
    "slug": slug.current,
    "imageUrl": image.asset->url + "?h=300&w=300&fit=crop"
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

export const ALL_TAGS = groq`
    *[_type=="tag"] | order(_createdAt desc) {
        ${TAG_QUERY}
    }
`;

export const POSTS_BY_TAG = groq`
    {
        "tag": *[_type=="tag" && slug.current==$slug][0] {
            ${TAG_QUERY}
        },
        "posts": *[_type=="post" && $slug in tags[]->slug.current] {
            ${POST_QUERY}
        }

    }
`;

export const SEARCH_QUERY = groq` {
    "tags": *[_type=="tag"]{
        ${TAG_QUERY}
    },
    "posts": *[_type=="post" && select($search != null => (title match $search + "*" || pt::text(content) match $search + "*" || $search + "*" match author->name), true) && select($tags != null => references(*[_type=="tag" && title in $tags]._id), true)] {
            ${POST_QUERY} 
        }
    }
`;

export const AUTHOR_BY_SLUG = groq`
    *[_type=="author" && slug.current==$slug][0] {
        ${AUTHOR_QUERY},
        "posts": *[_type=="post" && references(^._id)] {
            ${POST_QUERY}
        }
    }
`;
