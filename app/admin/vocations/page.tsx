"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, VocationsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { IVocacion } from "@/app/shared/interfaces";

const VocationsContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [vocations, setVocations] = useState<IVocacion[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/vocacion/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);

        const response = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const vocationsData = await response.json();
        setVocations(vocationsData);
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
        <VocationsDataTable vocations={vocations} />
      )}
    </>
  );
};

const VocationsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <VocationsContent />
    </Suspense>
  );
};

export default VocationsPage;
