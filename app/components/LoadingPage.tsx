import { Loader } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="pt-16 w-full flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
}
