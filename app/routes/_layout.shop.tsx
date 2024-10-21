import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientLoaderFunction,
  Form,
  json,
  useFetcher,
  useSearchParams,
} from "@remix-run/react";
import { Loader } from "lucide-react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { addToCart, getItems, getTags, hasIntent } from "~/api.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);

  const [items, tags] = await Promise.all([getItems(searchParams), getTags()]);

  return json({ items, tags });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  if (hasIntent(formData, "add-to-cart")) {
    await addToCart(formData);
  }

  return json(null);
};

export const clientLoader: ClientLoaderFunction = cacheClientLoader;
clientLoader.hydrate = true;

export default function Shop() {
  const { items, tags } = useCachedLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTags = new Set(searchParams.get("tags")?.split(","));
  const addToCartFetcher = useFetcher();

  const addingToCart = addToCartFetcher.formData?.get("productId") as string;

  return (
    <div className="space-y-4">
      <Form method="get" className="flex gap-4">
        <Button
          onClick={() =>
            setSearchParams((params) => {
              params.delete("tags");
              return new URLSearchParams(params);
            })
          }
        >
          Clear
        </Button>

        {tags.map((tag) => (
          <Button
            key={tag.name}
            type="submit"
            name="tags"
            value={tag.name}
            color="primary"
            variant={activeTags.has(tag.name) ? "solid" : "light"}
          >
            {tag.name}
          </Button>
        ))}
      </Form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="flex-1">
            <CardHeader className="flex justify-between">
              <p>{item.name}</p>
              <p className="text-sm text-gray-500">${item.price}</p>
            </CardHeader>

            <CardBody>
              <img
                src={item.imagePath}
                alt={item.name}
                className="object-cover h-[300px] w-full"
              />
            </CardBody>

            <CardFooter>
              <addToCartFetcher.Form
                method="post"
                action="/shop"
                className="w-full"
              >
                <input type="hidden" name="intent" value="add-to-cart" />
                <input type="hidden" name="productId" value={item.id} />

                <Button
                  type="submit"
                  className="w-full"
                  isDisabled={!!addingToCart}
                  startContent={
                    addingToCart === item.id ? (
                      <Loader className="animate-spin" />
                    ) : null
                  }
                >
                  Add to Cart
                </Button>
              </addToCartFetcher.Form>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
