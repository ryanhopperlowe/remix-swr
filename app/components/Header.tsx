import { Badge, Button } from "@nextui-org/react";
import { Link } from "@remix-run/react";
import { Loader, ShoppingBasketIcon } from "lucide-react";

export function Header({
  itemCount,
  email,
  isLoading,
}: {
  itemCount: number;
  email: string;
  isLoading: boolean;
}) {
  console.log("rerender");

  return (
    <div className="flex flex-col">
      <header className="grid w-full items-center grid-cols-3 p-4 italic text-primary">
        <div>{isLoading ? <Loader className="animate-spin" /> : null}</div>

        <Link to="/">
          <h1 className="text-2xl text-center font-bold">Calico Cut Pants</h1>
        </Link>

        <div className="flex items-center justify-end gap-4">
          <p>{email}</p>

          <Badge content={itemCount} color="primary">
            <Button isIconOnly as={Link} to="/cart" variant="light">
              <ShoppingBasketIcon />
            </Button>
          </Badge>
        </div>
      </header>

      <div className="bg-primary text-primary-foreground w-full p-4 flex justify-center">
        <p>FLASH SALE! Up to 60% off Pants & Belts for Summer!</p>
      </div>
    </div>
  );
}
