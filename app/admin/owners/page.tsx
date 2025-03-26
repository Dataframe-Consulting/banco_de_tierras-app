"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SearchBar, OwnersDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { ISocio, IPropietario } from "@/app/shared/interfaces";

const OwnersPageContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [socios, setSocios] = useState<ISocio[]>([]);
  const [propietarios, setPropietarios] = useState<IPropietario[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const socio_id = searchParams.get("socio_id") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const sociosResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/socio/`,
          { credentials: "include" }
        );
        const sociosData = await sociosResponse.json();
        setSocios(sociosData);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/propietario/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);
        if (socio_id) params.append("socio_id", socio_id);

        const propietariosResponse = await fetch(
          `${url}?${params.toString()}`,
          {
            credentials: "include",
          }
        );
        const propietariosData = await propietariosResponse.json();
        setPropietarios(propietariosData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, socio_id]);

  return (
    <>
      <SearchBar socios={socios} />
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <OwnersDataTable socios={socios} propietarios={propietarios} />
      )}
    </>
  );
};

const OwnersPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <OwnersPageContent />;
    </Suspense>
  );
};

export default OwnersPage;
