import { ActionFunction, ActionArgs } from "@remix-run/node";
import dayjs from "dayjs";
import { supabase } from "~/service/supabase.server";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const userId = formData.get("userId");
  const postId = formData.get("postId");

  if (!userId || !postId) {
    return new Response("", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  switch (request.method) {
    case "PATCH": {
      const response = await supabase.from("likes").upsert({
        created_at: dayjs().toISOString(),
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
        .eq("postId", postId)
        .eq("userId", userId);

      if (response.error) {
        console.log("Error", response.error);
        return null;
      }

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
