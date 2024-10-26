import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunction,
  ClientActionFunctionArgs,
  Form,
  json,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { Loader } from "lucide-react";
import useSWR, { mutate } from "swr";
import { getItems, getTags } from "~/api.client";
import { addToCart, hasIntent } from "~/api.server";
import { LoadingPage } from "~/components/LoadingPage";

export const clientLoader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const activeTags = searchParams.get("tags")?.split(",");

  return json({ activeTags });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("action");

  const formData = await request.formData();
  const shouldMutate: string[] = [];

  if (hasIntent(formData, "add-to-cart")) {
    await addToCart(formData);

    shouldMutate.push("cart");
  }

  return json({ shouldMutate });
};

export const clientAction: ClientActionFunction = async ({
  serverAction,
}: ClientActionFunctionArgs) => {
  console.log("clientAction");

  const { shouldMutate } = (await serverAction()) as {
    shouldMutate: string[];
  };

  await Promise.all(shouldMutate.map((key) => mutate(key)));
  return null;
};

export default function Shop() {
  const { activeTags } = useLoaderData<typeof clientLoader>();
  const [, setSearchParams] = useSearchParams();

  const { data: items, isLoading: itemsLoading } = useSWR(
    ["items", activeTags],
    () => getItems({ tags: activeTags })
  );
  const { data: tags, isLoading: tagsLoading } = useSWR("tags", getTags);

  const addToCartFetcher = useFetcher();

  const addingToCart = addToCartFetcher.formData?.get("productId") as string;

  if (tagsLoading) {
    return <LoadingPage />;
  }

  if (!tags) {
    return <div>No tags found</div>;
  }

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

        {tags?.map((tag) => (
          <Button
            key={tag.name}
            type="submit"
            name="tags"
            value={tag.name}
            color="primary"
            variant={activeTags?.includes(tag.name) ? "solid" : "light"}
          >
            {tag.name}
          </Button>
        ))}
      </Form>

      {itemsLoading && <LoadingPage />}

      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items?.map((item) => (
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
              <addToCartFetcher.Form method="post" className="w-full">
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
