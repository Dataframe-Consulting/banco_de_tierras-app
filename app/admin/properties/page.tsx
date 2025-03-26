"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { DatatableSkeleton } from "@/app/shared/components";
import { PropertiesDataTable, SearchBar } from "./components";
import type {
  IGarantia,
  IProyecto,
  ISociedad,
  IUbicacion,
  IPropiedad,
  IProcesoLegal,
} from "@/app/shared/interfaces";

const PropertiesPageContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [properties, setProperties] = useState<IPropiedad[]>([]);
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [sociedades, setSociedades] = useState<ISociedad[]>([]);
  const [ubicaciones, setUbicaciones] = useState<IUbicacion[]>([]);
  const [garantias, setGarantias] = useState<IGarantia[]>([]);
  const [procesosLegales, setProcesosLegales] = useState<IProcesoLegal[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const garantia_id = searchParams.get("garantia_id") || "";
  const proyecto_id = searchParams.get("proyecto_id") || "";
  const sociedad_id = searchParams.get("sociedad_id") || "";
  const ubicacion_id = searchParams.get("ubicacion_id") || "";
  const proceso_legal_id = searchParams.get("proceso_legal_id") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const fetchWithAuth = async (endpoint: string) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
            { credentials: "include" }
          );
          return response.json();
        };

        const [
          proyectosData,
          sociedadesData,
          ubicacionesData,
          garantiasData,
          procesosLegalesData,
        ] = await Promise.all([
          fetchWithAuth("proyecto/"),
          fetchWithAuth("sociedad/"),
          fetchWithAuth("ubicacion/"),
          fetchWithAuth("garantia/"),
          fetchWithAuth("proceso_legal/"),
        ]);
        setProyectos(proyectosData);
        setSociedades(sociedadesData);
        setUbicaciones(ubicacionesData);
        setGarantias(garantiasData);
        setProcesosLegales(procesosLegalesData);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/propiedad/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);
        if (garantia_id) params.append("garantia_id", garantia_id);
        if (proyecto_id) params.append("proyecto_id", proyecto_id);
        if (sociedad_id) params.append("sociedad_id", sociedad_id);
        if (ubicacion_id) params.append("ubicacion_id", ubicacion_id);
        if (proceso_legal_id)
          params.append("proceso_legal_id", proceso_legal_id);

        const propertiesResponse = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    q,
    garantia_id,
    proyecto_id,
    sociedad_id,
    ubicacion_id,
    proceso_legal_id,
  ]);

  return (
    <>
      <SearchBar
        proyectos={proyectos}
        garantias={garantias}
        sociedades={sociedades}
        ubicaciones={ubicaciones}
        procesosLegales={procesosLegales}
      />
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <PropertiesDataTable
          garantias={garantias}
          proyectos={proyectos}
          sociedades={sociedades}
          ubicaciones={ubicaciones}
          propiedades={properties}
          procesosLegales={procesosLegales}
        />
      )}
    </>
  );
};

const PropertiesPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <PropertiesPageContent />
    </Suspense>
  );
};

export default PropertiesPage;
