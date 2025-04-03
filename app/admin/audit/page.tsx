"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { AuditsDataTable, SearchBar } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { IAuditoria } from "@/app/shared/interfaces";

const AuditsContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [audits, setAudits] = useState<IAuditoria[]>([]);

  const searchParams = useSearchParams();
  const operacion = searchParams.get("operacion") || "";
  const tabla_afectada = searchParams.get("tabla_afectada") || "";
  const usuario_username = searchParams.get("usuario_username") || "";
  const registrado_desde = searchParams.get("registrado_desde") || "";
  const registrado_hasta = searchParams.get("registrado_hasta") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/auditoria/`);
        const params = new URLSearchParams();

        if (operacion) params.append("operacion", operacion);
        if (tabla_afectada) params.append("tabla_afectada", tabla_afectada);
        if (usuario_username)
          params.append("usuario_username", usuario_username);
        if (registrado_desde)
          params.append("registrado_desde", registrado_desde);
        if (registrado_hasta)
          params.append("registrado_hasta", registrado_hasta);

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
  }, [
    operacion,
    tabla_afectada,
    usuario_username,
    registrado_desde,
    registrado_hasta,
  ]);

  return (
    <>
      <SearchBar />
      {loading ? <DatatableSkeleton /> : <AuditsDataTable audits={audits} />}
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
