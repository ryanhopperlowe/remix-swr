import { redirect, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = () => redirect("/shop");

// Todo: Branding is Calico Cut Pants

export default function Index() {
  return null;
}
