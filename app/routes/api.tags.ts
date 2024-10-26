import { json } from "@remix-run/node";
import { getTags } from "~/api.server";

export async function loader() {
  const tags = await getTags();
  return json(tags);
}
