"use client";

import Link from "next/link";
import cn from "@/app/shared/utils/cn";
import { usePathname } from "next/navigation";
import { DownChevron } from "@/app/shared/icons";
import { useEffect, useRef, useState } from "react";

const SideBar = () => {
  const menuRef = useRef(null);
  const pathname = usePathname();
  const [otrosMenu, setOtrosMenu] = useState(false);

  const handleOtrosMenu = () => {
    setOtrosMenu(!otrosMenu);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !(menuRef.current as HTMLElement).contains(event.target as Node)
    ) {
      setOtrosMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="fixed z-20 top-0 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full pt-[5rem] px-4 pb-4 overflow-y-auto bg-[#C23B2E]">
        <ul className="flex flex-col gap-2 font-medium">
          <li>
            <LinkComp
              text="Inicio"
              href="/admin/home"
              isActive={pathname === "/admin/home"}
            />
          </li>
          <li>
            <LinkComp
              text="Rentas"
              href="/admin/rents"
              isActive={pathname === "/admin/rents"}
            />
          </li>
          <li>
            <LinkComp
              text="Propiedades"
              href="/admin/properties"
              isActive={pathname === "/admin/properties"}
            />
          </li>
          <li>
            <LinkComp
              text="Proyectos"
              href="/admin/projects"
              isActive={pathname === "/admin/projects"}
            />
          </li>
          <li>
            <LinkComp
              text="Garantías"
              href="/admin/guarantees"
              isActive={pathname === "/admin/guarantees"}
            />
          </li>
          <li>
            <LinkComp
              text="Procesos Legales"
              href="/admin/legal-processes"
              isActive={pathname === "/admin/legal-processes"}
            />
          </li>
          <li>
            <LinkComp
              text="Auditoría"
              href="/admin/audit"
              isActive={pathname === "/admin/audit"}
            />
          </li>

          <div className="border-t-2 border-white my-2" />

          <li ref={menuRef}>
            <button
              type="button"
              onClick={handleOtrosMenu}
              className="text-white p-2 flex items-center rounded-lg hover:bg-white hover:text-[#C23B2E] relative w-full"
            >
              Otros
              <span
                className={cn(
                  "absolute right-4 top-2.5 transform transition-all duration-300",
                  otrosMenu ? " rotate-180" : "rotate-0"
                )}
              >
                <DownChevron size="size-6" strokeWidth={2} />
              </span>
            </button>
            <ul
              className={cn(
                "flex flex-col gap-2 transition duration-300 ml-6 mt-2 space-y-2",
                otrosMenu ||
                  pathname === "/admin/locations" ||
                  pathname === "/admin/owners" ||
                  pathname === "/admin/physical-situations" ||
                  pathname === "/admin/vocations" ||
                  pathname === "/admin/specific-vocations"
                  ? "block"
                  : "hidden"
              )}
            >
              <li className="border-l-2 border-white pl-2">
                <LinkComp
                  text="Ubicaciones"
                  href="/admin/locations"
                  isActive={pathname === "/admin/locations"}
                />
              </li>
              <li className="border-l-2 border-white pl-2">
                <LinkComp
                  text="Propietarios"
                  href="/admin/owners"
                  isActive={pathname === "/admin/owners"}
                />
              </li>
              <li className="border-l-2 border-white pl-2">
                <LinkComp
                  text="Situaciones Físicas"
                  href="/admin/physical-situations"
                  isActive={pathname === "/admin/physical-situations"}
                />
              </li>
              <li className="border-l-2 border-white pl-2">
                <LinkComp
                  text="Vocaciones"
                  href="/admin/vocations"
                  isActive={pathname === "/admin/vocations"}
                />
              </li>
              <li className="border-l-2 border-white pl-2">
                <LinkComp
                  text="Vocaciones Específicas"
                  href="/admin/specific-vocations"
                  isActive={pathname === "/admin/specific-vocations"}
                />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;

interface ILinkComp {
  href: string;
  text: string;
  isActive: boolean;
}

const LinkComp = ({ href, text, isActive }: ILinkComp) => {
  return (
    <Link
      href={href}
      className={cn(
        "p-2 flex items-center rounded-lg hover:bg-white hover:text-[#C23B2E]",
        isActive ? "bg-white text-[#C23B2E]" : "text-white"
      )}
    >
      <p>{text}</p>
    </Link>
  );
};
