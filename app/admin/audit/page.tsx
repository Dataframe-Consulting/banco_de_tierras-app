"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { DatatableSkeleton } from "@/app/shared/components";
import { SearchBar, VocationsDataTable } from "./components";
import type { IAuditoria } from "@/app/shared/interfaces";

const AuditsContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [audits, setAudits] = useState<IAuditoria[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/auditoria/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);

        const response = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const auditsData = await response.json();
        setAudits(auditsData);
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
      {loading ? <DatatableSkeleton /> : <VocationsDataTable audits={audits} />}
    </>
  );
};

const AuditsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <AuditsContent />
    </Suspense>
  );
};

export default AuditsPage;
