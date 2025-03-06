"use client";

import { AuthProvider } from "@/app/providers/AuthProvider";

const AuthComponent = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthComponent;
