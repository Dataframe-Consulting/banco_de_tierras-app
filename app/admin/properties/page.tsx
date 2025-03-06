import { Suspense } from "react";
import { PropertiesDataTable, SearchBar } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type {
  IPropiedad,
  IProyecto,
  IUbicacion,
} from "@/app/shared/interfaces";

interface IPropertiesPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const PropertiesPage = async ({ searchParams }: IPropertiesPage) => {
  const {
    q = "",
    proyecto_id = "",
    ubicacion_id = "",
  } = (await searchParams) || {};

  const searchParamsForDatatable = { q, proyecto_id, ubicacion_id };

  const [proyectos, ubicacinoes] = await Promise.all([
    fetch("http://localhost:8000/api/proyecto"),
    fetch("http://localhost:8000/api/ubicacion"),
  ]);

  const proyectosData = (await proyectos.json()) as IProyecto[];
  const ubicacionesData = (await ubicacinoes.json()) as IUbicacion[];

  return (
    <>
      <SearchBar proyectos={proyectosData} ubicaciones={ubicacionesData} />
      <Suspense
        key={q + proyecto_id + ubicacion_id}
        fallback={<DatatableSkeleton />}
      >
        <DataFetch
          proyectos={proyectosData}
          ubicaciones={ubicacionesData}
          searchParams={searchParamsForDatatable}
        />
      </Suspense>
    </>
  );
};

export default PropertiesPage;

interface IDataFetch {
  proyectos: IProyecto[];
  ubicaciones: IUbicacion[];
  searchParams: { q?: string; proyecto_id?: string; ubicacion_id?: string };
}

const DataFetch = async ({
  proyectos,
  ubicaciones,
  searchParams,
}: IDataFetch) => {
  const url = new URL("http://localhost:8000/api/propiedad");
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);
  if (searchParams.proyecto_id)
    params.append("proyecto_id", searchParams.proyecto_id);
  if (searchParams.ubicacion_id)
    params.append("ubicacion_id", searchParams.ubicacion_id);

  const response = await fetch(`${url}?${params.toString()}`);
  const propertiesData = (await response.json()) as IPropiedad[];

  return (
    <PropertiesDataTable
      proyectos={proyectos}
      ubicaciones={ubicaciones}
      propiedades={propertiesData}
    />
  );
};
