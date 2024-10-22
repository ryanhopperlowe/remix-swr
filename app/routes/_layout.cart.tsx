import { Button, Card } from "@nextui-org/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { json, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Loader, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { clearCart, getCart, hasIntent, updateQuantity } from "~/api.server";

export async function loader() {
  return json({ cart: await getCart() });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  if (hasIntent(formData, "updateQuantity")) {
    const response = await updateQuantity(formData);
    return json({ updatedId: response.itemId });
  }

  if (hasIntent(formData, "clearCart")) {
    await clearCart();
    return json({ isCleared: true });
  }
};

export default function Cart() {
  const { cart } = useLoaderData<typeof loader>();
  const { items = [] } = cart || {};

  const clearCart = useFetcher<{ isCleared: boolean }>();
  const updateQuantity = useFetcher<{ updatedId: string | null }>();
  const updatingItem = getUpdatingId();

  return (
    <div className="h-full flex flex-col gap-4">
      {items.map(({ item, quantity }) => (
        <Card
          className="p-4 w-full flex flex-row items-center justify-between"
          key={item.id}
        >
          <div className="flex gap-4 items-center">
            <p>{item.name}</p>
          </div>

          <updateQuantity.Form
            className="flex justify-end items-center gap-2"
            method="post"
          >
            <input type="hidden" name="intent" value="updateQuantity" />
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="cartId" value={cart.id} />

            {updatingItem === item.id && <Loader className="animate-spin" />}

            <Button
              isIconOnly
              name="quantity"
              value={String(quantity + 1)}
              type="submit"
              size="sm"
              variant="light"
            >
              <PlusIcon />
            </Button>

            <div>{quantity}</div>

            <Button
              isIconOnly
              variant="light"
              name="quantity"
              size="sm"
              value={String(quantity - 1)}
              type="submit"
            >
              {quantity > 1 ? <MinusIcon /> : <TrashIcon />}
            </Button>
          </updateQuantity.Form>
        </Card>
      ))}

      {items.length ? (
        <clearCart.Form method="post">
          <Button
            type="submit"
            name="intent"
            value="clearCart"
            color="danger"
            variant="flat"
            className="w-full"
            startContent={
              clearCart.state !== "idle" ? (
                <Loader className="animate-spin" />
              ) : null
            }
          >
            Clear Cart
          </Button>
        </clearCart.Form>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-4">
          <p>Your cart is empty</p>

          <Button as={Link} to="/shop" variant="shadow" color="primary">
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );

  function getUpdatingId() {
    if (updateQuantity.state === "loading") {
      return updateQuantity.data?.updatedId;
    }

    if (updateQuantity.state === "submitting") {
      return updateQuantity.formData?.get("itemId");
    }

    return null;
  }
}
