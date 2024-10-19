import { Outlet } from "@remix-run/react";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex-1 overflow-auto">
        <main className="container mx-auto p-4 space-y-4">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
