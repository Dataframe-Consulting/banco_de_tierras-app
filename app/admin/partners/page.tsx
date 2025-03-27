"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SearchBar, PartnersDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { ISocio } from "@/app/shared/interfaces";

const PartnersPageContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [partners, setPartners] = useState<ISocio[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/socio/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);

        const response = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const data = await response.json();
        setPartners(data);
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
        <PartnersDataTable partners={partners} />
      )}
    </>
  );
};

const PartnersPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <PartnersPageContent />
    </Suspense>
  );
};

export default PartnersPage;
