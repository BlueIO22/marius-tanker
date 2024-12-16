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
        content[]{
        ...,
        "image": image.asset->{
        ...,
        "creditLineFromUnsplash": {
            "url": source.url,
            "line":  creditLine
        }},
        },
        "imageUrl": image.asset->url,
        "slug": slug.current,
        "previewImageUrl": image.asset->url + "?h=600&w=600",
        tags[]->{
            ${TAG_QUERY}
        }, 
        imageCreditLine,
        "_createdTime": _createdAt,
        "creditLineFromUnsplash": {
            "url": image.asset->source.url,
            "line":  image.asset->creditLine
        },
        "estimatedReadingTime": round(length(pt::text(content)) / 5 / 180 ),
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

export const ALL_POSTS = groq`
    *[_type=="post"] | order(_createdAt desc) {
        ${POST_QUERY}   
    }
`;

export const LATEST_POSTS = groq`
    *[_type=="post"] | order(_createdAt desc) [0..10] {
        ${POST_QUERY}
    }
`;

export const POST_BY_SLUG = groq`
    *[_type=="post" && slug.current==$slug] [0] {
        ${POST_QUERY},
        "relatedPosts": *[_type=="post" && _id==^._id] [0] {
            "postsByTag": *[_type=="post" && count((tags[]._ref)[@ in  ^.tags[]._ref])>0 && _id != ^._id] | order(_createdAt desc) [0..2] {
                ${POST_QUERY}
            },
            "postsByAuthor": *[_type=="post" && author._ref==^.author._ref && _id != ^._id] | order(_createdAt desc) [0..2] {
                ${POST_QUERY}
            },
            "latestPosts": *[_type=="post" && _id != ^._id] | order(_createdAt desc) [0..2] {
                ${POST_QUERY}
            }
        }
    }
    
`;

export const FRONTPAGE_QUERY = groq`
    *[_type=="frontpage"][0] {
        blocks[]->{
            ...,
            ${POST_QUERY},
            
            "authorPosts": *[_type=="post" && references(^._id)] | order(_createdAt desc) [0..5] {
                ${POST_QUERY}
            },
            posts[]->{
                ${POST_QUERY},
            }
        }
    }
`;

export const RELATED_POSTS_QUERY = groq`
    *[_type=="post" && _id==$postId] [0] {
        "postsByTag": *[_type=="post" && count((tags[]._ref)[@ in  ^.tags[]._ref])>0 && _id != ^._id] | order(_createdAt desc) [0..2] {
            ${POST_QUERY}
        },
        "postsByAuthor": *[_type=="post" && author._ref==^.author._ref && _id != ^._id] | order(_createdAt desc) [0..2] {
            ${POST_QUERY}
        },
        "latestPosts": *[_type=="post" && _id != ^._id] | order(_createdAt desc) [0..2] {
            ${POST_QUERY}
        },
 }`;

export const ALL_TAGS = groq`
    *[_type=="tag"] | order(_createdAt desc) {
        ${TAG_QUERY},
        "countOfPosts": count(*[_type=="post" && references(^._id)])
    }
`;

export const POSTS_BY_TAG = groq`
    {
        "tag": *[_type=="tag" && slug.current==$slug][0] { 
            ${TAG_QUERY}
        },
        "posts": *[_type=="post" && $slug in tags[]->slug.current] | order(_createdAt desc) {
            ${POST_QUERY}
        }

    }
`;

export const SEARCH_QUERY = groq` {
    "tags": *[_type=="tag" && (isVisible==true || defined(isVisible) == false) && count(*[_type=="post" && references(^._id)])>0][0..9] | order(_createdAt desc) {    
        ${TAG_QUERY}
    },
    "posts": *[_type=="post" && select($search != null => (title match $search + "*" || pt::text(content) match $search + "*" || $search + "*" match author->name || tags[]->title match $search + "*"), true) && select($tags != null => references(*[_type=="tag" && title in $tags]._id), true)] [0..20] {
            ${POST_QUERY} 
        }
    }
`;

export const AUTHOR_BY_SLUG = groq`
    *[_type=="author" && slug.current==$slug][0] {
        ${AUTHOR_QUERY},
        "posts": *[_type=="post" && references(^._id)] | order(_createdAt desc) {   
            ${POST_QUERY}
        }
    }
`;

export const ALL_AUTHORS = groq`
    *[_type=="author"] | order(name) {
        ${AUTHOR_QUERY}
    }
`;
