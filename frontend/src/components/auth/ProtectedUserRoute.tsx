import { Navigate } from "react-router-dom";
import { useCheckAuth } from "@/hooks/useAuth";
import type { JSX } from "react";
import Loader from "../ui/Loader";

function ProtectedUserRoute({ children }: { children: JSX.Element }) {
  const { isUser, isCheckingAuth } = useCheckAuth();

  if (isCheckingAuth) return <Loader />;
  if (!isUser) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedUserRoute;
