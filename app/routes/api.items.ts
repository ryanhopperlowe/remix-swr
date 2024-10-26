import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getItems } from "~/api.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const items = await getItems(searchParams);
  return json(items);
}
