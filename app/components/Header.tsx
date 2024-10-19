import { Button } from "@nextui-org/react";
import { ShoppingBasketIcon } from "lucide-react";

export function Header() {
  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between p-4 italic text-primary">
        <div />

        <h1 className="text-2xl font-bold">Calico Cut Pants</h1>

        <Button isIconOnly>
          <ShoppingBasketIcon />
        </Button>
      </header>

      <div className="bg-primary text-primary-foreground w-full p-4 flex justify-center">
        <p>FLASH SALE! Up to 60% off Pants & Belts for Summer!</p>
      </div>
    </div>
  );
}
