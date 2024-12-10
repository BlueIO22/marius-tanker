export type Comment = {
  id: string;
  text: string;
  postId: string;
  userId: string;
  ref: string;
  created_at: string;
  root?: string;
  comments?: Comment[];
  likes: Array<Like>;
};

export type Like = {
  id: string;
  postId: string;
  userId: string;
  commentId: string;
  created_at: string;
};
