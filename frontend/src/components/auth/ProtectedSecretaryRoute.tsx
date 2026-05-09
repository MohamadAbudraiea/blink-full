import { Navigate } from "react-router-dom";
import { useCheckAuth } from "@/hooks/useAuth";
import type { JSX } from "react";
import Loader from "../ui/Loader";

function ProtectedSecretaryRoute({ children }: { children: JSX.Element }) {
  const { isSecretary, isCheckingAuth } = useCheckAuth();

  if (isCheckingAuth) return <Loader />;
  if (!isSecretary) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedSecretaryRoute;
