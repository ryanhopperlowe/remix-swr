import { useLocation, useNavigate } from "@remix-run/react";
import { useCallback } from "react";

export function useRevalidate() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    console.log("revalidating");
    return navigate(location, { replace: true });
  }, [location, navigate]);
}
