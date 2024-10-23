import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "afqsdc5q",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-10-23",
});
