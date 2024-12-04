export type Comment = {
  id: string;
  text: string;
  postId: string;
  userId: string;
  ref: string;
  created_at: string;
  comments?: Comment[];
};
