export type SanityAuthor = {
  _id: string;
  name: string;
  slug: string;
  age?: number;
  imageUrl: string;
  description: [];
};

export type SanityPost = {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: [];
  imageUrl: string;
  previewImageUrl: string;
  author?: SanityAuthor;
};
