import { createContext, useEffect, useState } from "react";
import type { IUser } from "../shared/interfaces";

export interface IAuthContext {
  user: IUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (pathname === "/login" && user) {
        window.location.href = "/admin/home";
      }

      if (pathname.startsWith("/admin") && !user) {
        window.location.href = "/login";
      }
    }
  }, [loading, pathname, user]);

  const login = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: formData.toString(),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
};
