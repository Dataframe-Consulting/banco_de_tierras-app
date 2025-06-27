"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, AuditsDataTable } from "./components";
import { DatatableSkeleton, PageLayout } from "@/app/shared/components";
import type { IAuditoria } from "@/app/shared/interfaces";

const AuditContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [audits, setAudits] = useState<IAuditoria[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const searchParamsObj = Object.fromEntries(searchParams.entries());
      const params = new URLSearchParams(searchParamsObj);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auditoria/?${params.toString()}`, {
          credentials: "include"
        });
        if (response.ok) {
          const result = await response.json();
          setAudits(Array.isArray(result) ? result : (result.data || []));
        }
      } catch (error) {
        console.error("Error fetching audit data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <PageLayout searchBar={<SearchBar />}>
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <AuditsDataTable audits={audits} />
      )}
    </PageLayout>
  );
};

const AuditPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <AuditContent />
    </Suspense>
  );
};

export default AuditPage;
