"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, SpecificVocationsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { IVocacionEspecifica } from "@/app/shared/interfaces";

const SpecificVocationsContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [specificVocations, setSpecificVocations] = useState<
    IVocacionEspecifica[]
  >([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/vocacion_especifica/`
        );
        const params = new URLSearchParams();

        if (q) params.append("q", q);

        const response = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const specificVocationsData = await response.json();
        setSpecificVocations(specificVocationsData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, refresh]);

  return (
    <>
      <SearchBar />
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <SpecificVocationsDataTable
          specificVocations={specificVocations}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}
    </>
  );
};

const SpecificVocationsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <SpecificVocationsContent />;
    </Suspense>
  );
};

export default SpecificVocationsPage;
