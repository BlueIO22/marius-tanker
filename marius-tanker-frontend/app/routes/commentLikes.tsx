import { ActionFunction, ActionArgs } from "@remix-run/node";
import dayjs from "dayjs";
import { supabase } from "~/service/supabase.server";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const commentId = formData.get("id");
  const userId = formData.get("userId");
  const postId = formData.get("postId");

  if (!commentId || !userId) {
    return new Response("", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  switch (request.method) {
    case "PATCH": {
      console.log("Pathing this baby up", commentId, userId);
      const response = await supabase.from("likes").upsert({
        created_at: dayjs().toISOString(),
        commentId: commentId,
        postId: postId,
        userId: userId,
      });

      if (response.error) {
        console.log("Error", response.error);
        return null;
      }

      return null;
    }
    case "DELETE": {
      const response = await supabase
        .from("likes")
        .delete()
        .eq("commentId", commentId)
        .eq("userId", userId);

      if (response.error) {
        console.log("Error", response.error);
        return null;
      }

      console.log("Removed like", commentId, userId);

      return new Response("", {
        status: 200,
      });
    }
  }

  return new Response("", {
    status: 400,
    statusText: "Bad Request",
  });
};
