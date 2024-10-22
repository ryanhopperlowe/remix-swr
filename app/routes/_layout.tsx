import { json, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { getCart, getUser } from "~/api.server";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export async function loader() {
  const [cart, user] = await Promise.all([getCart(), getUser()]);

  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const email = user?.email ?? "Guest";

  return json({ itemCount, email });
}

export default function Layout() {
  const { itemCount, email } = useLoaderData<typeof loader>();

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
