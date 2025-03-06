"use client";

import Link from "next/link";
import cn from "@/app/shared/utils/cn";
import { usePathname } from "next/navigation";
import { DownChevron } from "@/app/shared/icons";
import { useEffect, useRef, useState } from "react";

const SideBar = () => {
  const menuRef = useRef(null);
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
            <LinkComp href="/admin/home" text="Inicio" />
          </li>
          <li>
            <LinkComp href="/admin/rents" text="Rentas" />
          </li>
          <li>
            <LinkComp href="/admin/properties" text="Propiedades" />
          </li>
          <li>
            <LinkComp href="/admin/projects" text="Proyectos" />
          </li>
          <li>
            <LinkComp href="/admin/guarantees" text="Garantías" />
          </li>
          <li>
            <LinkComp href="/admin/legal-processes" text="Procesos Legales" />
          </li>

          <li ref={menuRef} className="mt-4">
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
                "flex flex-col gap-2 transition duration-300",
                otrosMenu ? "block" : "hidden"
              )}
            >
              <li>
                <LinkComp href="/admin/locations" text="Ubicaciones" />
              </li>
              <li>
                <LinkComp href="/admin/owners" text="Propietarios" />
              </li>
              <li>
                <LinkComp href="/admin/partners" text="Socios" />
              </li>
              <li>
                <LinkComp href="/admin/societies" text="Sociedades" />
              </li>
              <li>
                <LinkComp
                  href="/admin/physical-situations"
                  text="Situaciones Físicas"
                />
              </li>
              <li>
                <LinkComp href="/admin/vocations" text="Vocaciones" />
              </li>
              <li>
                <LinkComp
                  href="/admin/specific-vocations"
                  text="Vocaciones Específicas"
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
}

const LinkComp = ({ href, text }: ILinkComp) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

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
