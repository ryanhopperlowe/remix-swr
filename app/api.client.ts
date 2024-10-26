import { Cart, CartItem, Item, Tag, User } from "@prisma/client";
import queryString from "query-string";
import { zfd } from "zod-form-data";

const intentSchema = zfd.formData({
  intent: zfd.text(),
});

export const clientHasIntent = (formData: FormData, intent: string) => {
  const { intent: formIntent } = intentSchema.parse(formData);
  return formIntent === intent;
};

export function getCart(): Promise<
  Cart & { items: (CartItem & { item: Item })[] }
> {
  return fetch("/api/cart").then((res) => res.json());
}

export function getUser(): Promise<User> {
  return fetch("/api/user").then((res) => res.json());
}

export function getTags(): Promise<Tag[]> {
  return fetch("/api/tags").then((res) => res.json());
}

export function getItems(params: { tags?: string[] }): Promise<Item[]> {
  const query = queryString.stringify(params);
  return fetch(`/api/items?${query}`).then((res) => res.json());
}
