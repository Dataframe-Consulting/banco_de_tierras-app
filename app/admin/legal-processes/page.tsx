"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { SearchBar, LegalProcessesDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { IProcesoLegal } from "@/app/shared/interfaces";

const LegalProcessesPageContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [legalProcesses, setLegalProcesses] = useState<IProcesoLegal[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/proceso_legal/`
        );
        const params = new URLSearchParams();

        if (q) params.append("q", q);

        const response = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const data = await response.json();
        setLegalProcesses(data);
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
        <LegalProcessesDataTable
          legalProcesses={legalProcesses}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}
    </>
  );
};

const LegalProcessesPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <LegalProcessesPageContent />
    </Suspense>
  );
};

export default LegalProcessesPage;
