"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LeftChevron, RightChevron } from "@/app/shared/icons";
import { usePathname, useSearchParams } from "next/navigation";

interface IPagination {
  totalPages: number;
}

const Pagination = ({ totalPages }: IPagination) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [visiblePages, setVisiblePages] = useState<number>(5);

  useEffect(() => {
    const updateVisiblePages = () => {
      if (window.innerWidth < 640) setVisiblePages(3);
      else if (window.innerWidth < 1024) setVisiblePages(5);
      else setVisiblePages(7);
    };

    updateVisiblePages();
    window.addEventListener("resize", updateVisiblePages);
    return () => window.removeEventListener("resize", updateVisiblePages);
  }, []);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (startPage > 1) pages.push(1, "...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages) pages.push("...", totalPages);

    return pages.map((page, index) => (
      <li key={index}>
        {typeof page === "number" ? (
          <Link
            href={createPageURL(page)}
            passHref
            className={`flex items-center justify-center px-3 h-8 leading-tight border ${
              currentPage === page
                ? "link-button-blue !rounded-none"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {page}
          </Link>
        ) : (
          <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 select-none">
            {page}
          </span>
        )}
      </li>
    ));
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="inline-flex text-sm mt-4 justify-center w-full">
        <li>
          {currentPage > 1 ? (
            <Link
              href={createPageURL(currentPage - 1)}
              passHref
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
            >
              <p className="hidden md:block">Anterior</p>
              <LeftChevron customClass="block md:hidden" />
            </Link>
          ) : (
            <p
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-300 bg-gray-100 border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed select-none"
              aria-disabled="true"
            >
              <span className="hidden md:block">Anterior</span>
              <LeftChevron customClass="block md:hidden" />
            </p>
          )}
        </li>
        {renderPageNumbers()}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={createPageURL(currentPage + 1)}
              passHref
              className="flex items-center justify-center px-3 h-8 leading-tight border rounded-e-lg text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              <p className="hidden md:block">Siguiente</p>
              <RightChevron customClass="block md:hidden" />
            </Link>
          ) : (
            <p
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-300 bg-gray-100 border rounded-e-lg border-gray-300 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              <span className="hidden md:block">Siguiente</span>
              <RightChevron customClass="block md:hidden" />
            </p>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
