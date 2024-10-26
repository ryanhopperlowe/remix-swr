import { json } from "@remix-run/node";
import { getUser } from "~/api.server";

export async function loader() {
  const user = await getUser();
  return json({ user });
}
