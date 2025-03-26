"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SearchBar, RentsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { IPropiedad, IRenta } from "@/app/shared/interfaces";

const RentsPageContent = () => {
  const [propiedades, setPropiedades] = useState<IPropiedad[]>([]);
  const [rentsData, setRentsData] = useState<IRenta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const propiedad_id = searchParams.get("propiedad_id") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const propiedadesResponse = await fetch(
          `https://bdt-web-app.azurewebsites.net/api/propiedad`,
          {
            credentials: "include",
          }
        );
        const propiedadesData = await propiedadesResponse.json();
        setPropiedades(propiedadesData);

        const url = new URL(`https://bdt-web-app.azurewebsites.net/api/renta`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);
        if (propiedad_id) params.append("propiedad_id", propiedad_id);

        const rentsResponse = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const rentsData = await rentsResponse.json();
        setRentsData(rentsData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, propiedad_id]);

  return (
    <>
      <SearchBar propiedades={propiedades} />
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <RentsDataTable rents={rentsData} propiedades={propiedades} />
      )}
    </>
  );
};

const RentsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <RentsPageContent />
    </Suspense>
  );
};

export default RentsPage;
