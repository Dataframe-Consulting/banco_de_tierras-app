"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, PhysicalSituationsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { ISituacionFisica } from "@/app/shared/interfaces";

const PhysicalSituationsContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [physicalSituations, setPhysicalSituations] = useState<
    ISituacionFisica[]
  >([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/situacion_fisica/`
        );
        const params = new URLSearchParams();

        if (q) params.append("q", q);

        const response = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const physicalSituationsData = await response.json();
        setPhysicalSituations(physicalSituationsData);
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
        <PhysicalSituationsDataTable physicalSituations={physicalSituations} />
      )}
    </>
  );
};

const PhysicalSituations = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <PhysicalSituationsContent />
    </Suspense>
  );
};

export default PhysicalSituations;
