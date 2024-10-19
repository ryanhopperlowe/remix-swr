import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useLoaderData, useSearchParams } from "@remix-run/react";
import { prisma } from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const tagParams = searchParams.get("tags")?.split(",");

  const tags = await prisma.tag.findMany();

  const items = await prisma.item.findMany({
    where: tagParams?.length
      ? { tags: { some: { name: { in: tagParams } } } }
      : undefined,
  });

  return json({ items, tags });
};

export default function Shop() {
  const { items, tags } = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTags = new Set(searchParams.get("tags")?.split(","));

  return (
    <div className="space-y-4">
      <Form method="get" className="flex gap-4">
        <Button
          onClick={() =>
            setSearchParams((params) => {
              params.delete("tags");
              return params;
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

      <div className="grid grid-cols-3 gap-4">
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
                className="object-cover h-[200%] w-[100%]"
              />
            </CardBody>

            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
