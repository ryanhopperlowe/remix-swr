import { Outlet } from "@remix-run/react";
import useSWR from "swr";
import { getCart, getUser } from "~/api.client";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export function clientLoader() {
  return null;
}

export default function Layout() {
  const { data: cart, isValidating: cartIsValidating } = useSWR(
    "cart",
    getCart
  );

  const itemCount =
    cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const { data: user, isValidating: userIsValidating } = useSWR(
    "user",
    getUser
  );

  const isValidating = cartIsValidating || userIsValidating;

  return (
    <div className="flex flex-col h-screen">
      <Header
        itemCount={itemCount}
        email={user?.email || "Guest"}
        isLoading={isValidating}
      />

      <div className="flex-1 overflow-auto">
        <main className="container mx-auto p-4 space-y-4">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
