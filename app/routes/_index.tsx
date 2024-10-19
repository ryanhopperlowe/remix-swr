import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// Todo: Branding is Calico Cut Pants

export default function Index() {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="bg-primary text-white w-full p-4 flex justify-center">
        <p>FLASH SALE! Up to 60% off Pants & Belts for Summer!</p>
      </div>

      <div className="flex-auto mx-auto w-full max-w-screen-md p-4">
        Hi there
      </div>

      <div className="bg-primary text-white w-full p-4 flex justify-center">
        <p>You gotta give!</p>
      </div>
    </div>
  );
}
