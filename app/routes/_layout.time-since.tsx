import { json } from "@remix-run/node";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

export async function loader() {
  const timeSince = new Date();
  return json({ timeSince });
}

export const clientLoader = cacheClientLoader;

export default function TimeSince() {
  const { timeSince } = useCachedLoaderData<typeof loader>();

  // useRevalidateOnInterval({ interval: 1000 });

  return (
    <div className="text-4xl w-full h-full flex justify-center items-center">
      {new Date(timeSince).toLocaleTimeString()}
    </div>
  );
}
