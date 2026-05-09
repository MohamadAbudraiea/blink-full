import { Navigate } from "react-router-dom";
import { useCheckAuth } from "@/hooks/useAuth";
import type { JSX } from "react";
import Loader from "../ui/Loader";

function ProtectedDetailerRoute({ children }: { children: JSX.Element }) {
  const { isDetailer, isCheckingAuth } = useCheckAuth();

  if (isCheckingAuth) return <Loader />;
  if (!isDetailer) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedDetailerRoute;
