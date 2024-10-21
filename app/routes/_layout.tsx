import {
  ClientLoaderFunction,
  json,
  Outlet,
  useNavigation,
} from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { getCart, getUser } from "~/api.server";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const [cart, user] = await Promise.all([getCart(), getUser()]);

  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const email = user?.email ?? "Guest";

  return json({ itemCount, email });
}

export const clientLoader: ClientLoaderFunction = (args) =>
  cacheClientLoader(args, { key: "cart-count" });
clientLoader.hydrate = true;

export default function Layout() {
  const { itemCount, email } = useCachedLoaderData<typeof loader>();

  const isLoading = useNavigation().state === "loading";

  return (
    <div className="flex flex-col h-screen">
      <Header itemCount={itemCount} email={email} isLoading={isLoading} />

      <div className="flex-1 overflow-auto">
        <main className="container mx-auto p-4 space-y-4">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
