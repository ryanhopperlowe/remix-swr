import { redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getCart } from "~/api.server";

export async function loader() {
  const cart = await getCart();

  if (!cart) return redirect("/");

  return json(cart);
}
