import { AuthContext, IAuthContext } from "@/app/providers/AuthProvider";
import { useContext } from "react";

const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe estar dentro de un AuthProvider");
  return context;
};

export default useAuth;
