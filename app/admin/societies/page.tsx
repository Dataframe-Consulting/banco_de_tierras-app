"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SearchBar, SocietiesDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { ISociedad } from "@/app/shared/interfaces";

const SocietiesPageContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [societies, setSocieties] = useState<ISociedad[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/sociedad/`);
        const params = new URLSearchParams();
        if (q) params.append("q", q);

        const response = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const societiesData = await response.json();
        setSocieties(societiesData);
      } catch (error) {
        console.error("Error fetching data", error);
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
        <SocietiesDataTable societies={societies} />
      )}
    </>
  );
};

const SocietiesPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <SocietiesPageContent />
    </Suspense>
  );
};

export default SocietiesPage;
