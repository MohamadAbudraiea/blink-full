import { Navigate } from "react-router-dom";
import { useCheckAuth } from "@/hooks/useAuth";
import type { JSX } from "react";
import Loader from "../ui/Loader";

function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  const { isAdmin, isCheckingAuth } = useCheckAuth();

  if (isCheckingAuth) return <Loader />;
  if (!isAdmin) return <Navigate to="*" replace />;

  return children;
}

export default ProtectedAdminRoute;
