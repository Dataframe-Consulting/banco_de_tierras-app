"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DatatableSkeleton } from "@/app/shared/components";
import { SearchBar, GuaranteesDataTable } from "./components";
import type { IGarantia } from "@/app/shared/interfaces";

const GuaranteesPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [guarantees, setGuarantees] = useState<IGarantia[]>([]);
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/garantia/`);
        if (q) url.searchParams.append("q", q);

        const response = await fetch(url.toString(), {
          credentials: "include",
        });
        const data = await response.json();
        setGuarantees(data);
      } catch (error) {
        console.error("Error fetching guarantees", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  return (
    <>
      <SearchBar />
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <GuaranteesDataTable guarantees={guarantees} />
      )}
    </>
  );
};

export default GuaranteesPage;
