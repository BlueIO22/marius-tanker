export type SanityTag = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  parent?: SanityTag;
  countOfPosts?: number;
};

export type SanityAuthor = {
  _id: string;
  name: string;
  _type: string;
  slug: string;
  age?: number;
  githubUsername?: string;
  imageUrl: string;
  occupation: string;
  description: [];
  posts?: SanityPost[];
};

export type SanityPost = {
  _id: string;
  slug: string;
  _type: string;
  title: string;
  subtitle: string;
  excerpt: string;
  _createdTime: string;
  content: [];
  imageUrl: string;
  previewImageUrl: string;
  tldr?: {
    title: string;
    content: [];
  };
  author?: SanityAuthor;
  estimatedReadingTime?: number;
  isWrittenByAI?: boolean;
  tags?: SanityTag[];
  creditLineFromUnsplash?: {
    line?: string;
    url?: string;
  };
  relatedPosts?: {
    postsByTag: SanityPost[];
    postsByAuthor: SanityPost[];
    latestPosts: SanityPost[];
  };
  imageCreditLine?: string;
};

export type SanityGrid = {
  title: string;
  _type: string;
  _id: string;
  columns: number;
  rows: number;
  posts: SanityPost[];
};

export type SanityBlockObject =
  | SanityPost
  | SanityGrid
  | SanityAuthor
  | SanityTag;
