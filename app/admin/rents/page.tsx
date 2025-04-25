"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SearchBar, RentsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { IPropiedad, IProyecto, IRenta } from "@/app/shared/interfaces";

const RentsPageContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rentsData, setRentsData] = useState<IRenta[]>([]);
  const [propiedades, setPropiedades] = useState<IPropiedad[]>([]);
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const propiedad_id = searchParams.get("propiedad_id") || "";
  const proyecto_id = searchParams.get("proyecto_id") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const propiedadesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedad/`,
          {
            credentials: "include",
          }
        );
        const propiedadesData = await propiedadesResponse.json();
        setPropiedades(propiedadesData);

        const proyectosResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/proyecto/`,
          {
            credentials: "include",
          }
        );
        const proyectosData = await proyectosResponse.json();
        setProyectos(proyectosData);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/renta/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);
        if (propiedad_id) params.append("propiedad_id", propiedad_id);
        if (proyecto_id) params.append("proyecto_id", proyecto_id);

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
  }, [q, propiedad_id, proyecto_id, refresh]);

  return (
    <>
      <SearchBar propiedades={propiedades} proyectos={proyectos} />
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <RentsDataTable
          rents={rentsData}
          propiedades={propiedades}
          refresh={() => setRefresh((prev) => !prev)}
        />
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
