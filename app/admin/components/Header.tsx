"use client";

import Image from "next/image";
import { useAuth } from "@/app/shared/hooks";
import { DoorArrowRight } from "@/app/shared/icons";

const Header = () => {
  const { logout } = useAuth();

  const handleLogOut = async () => {
    await logout();
    // window.location.href = "/login";
  };

  return (
    <header className="fixed z-30 top-0 w-full">
      <nav className="h-full flex flex-col items-center p-2 mx-auto bg-[#C23B2E]">
        <ul className="w-full flex justify-between items-center gap-4">
          <li>
            <div className="w-full mt-2">
              <Image
                priority
                width={100}
                height={100}
                alt="Logo de Banco de Tierras"
                className="object-cover size-full"
                src="/assets/images/main-logo.webp"
              />
            </div>
          </li>
          <li>
            <button
              title="Cerrar sesión"
              onClick={() => handleLogOut()}
              className="px-2 py-1 rounded-lg bg-white"
            >
              <DoorArrowRight />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
