import { zfd } from "zod-form-data";
import { prisma, userId } from "./db.server";

const intentSchema = zfd.formData({
  intent: zfd.text(),
});

const SLEEP_TIME = 1000;

export function hasIntent(formData: FormData, intent: string) {
  const { intent: formIntent } = intentSchema.parse(formData);
  return formIntent === intent;
}

const sleep = (ms = SLEEP_TIME) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getItems(params: URLSearchParams) {
  await sleep();

  const tagParams = params.get("tags")?.split(",");

  return prisma.item.findMany({
    where: tagParams?.length
      ? { tags: { some: { name: { in: tagParams } } } }
      : undefined,
  });
}

export async function getTags() {
  await sleep();
  return prisma.tag.findMany();
}

export const addToCartSchema = zfd.formData({
  productId: zfd.text(),
});

export async function addToCart(formData: FormData) {
  await sleep();
  const { productId } = addToCartSchema.parse(formData);

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) throw new Error("Cart was not found or created");

  if (cart.items.find((item) => item.itemId === productId)) {
    return await prisma.cartItem.update({
      where: { cartId_itemId: { cartId: cart.id, itemId: productId } },
      data: { quantity: { increment: 1 } },
    });
  } else {
    return await prisma.cartItem.create({
      data: { itemId: productId, cartId: cart.id, quantity: 1 },
    });
  }
}

export async function clearCart() {
  await sleep();
  await prisma.cartItem.deleteMany({
    where: { cart: { userId } },
  });
}

export async function getCart() {
  await sleep();
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { item: true } } },
  });

  if (!cart) throw new Error("Cart was not found");

  return cart;
}

export async function getUser() {
  await sleep();
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

const updateQuantitySchema = zfd.formData({
  itemId: zfd.text(),
  cartId: zfd.text(),
  quantity: zfd.numeric(),
});

export async function updateQuantity(formData: FormData) {
  await sleep();

  const { itemId, cartId, quantity } = updateQuantitySchema.parse(formData);

  if (quantity === 0) {
    return await prisma.cartItem.delete({
      where: { cartId_itemId: { cartId, itemId } },
    });
  } else {
    return await prisma.cartItem.update({
      where: { cartId_itemId: { cartId, itemId } },
      data: { quantity },
    });
  }
}
