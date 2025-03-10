import { Suspense } from "react";
import { PropertiesDataTable, SearchBar } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type {
  IPropiedad,
  IProyecto,
  IUbicacion,
} from "@/app/shared/interfaces";
import { cookies } from "next/headers";

interface IPropertiesPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const PropertiesPage = async ({ searchParams }: IPropertiesPage) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const {
    q = "",
    proyecto_id = "",
    ubicacion_id = "",
  } = (await searchParams) || {};

  const searchParamsForDatatable = { q, proyecto_id, ubicacion_id };

  const [proyectos, ubicaciones] = await Promise.all([
    fetch("http://localhost:8000/api/proyecto", {
      headers: {
        Authorization: `${token?.value}`,
      },
    }),
    fetch("http://localhost:8000/api/ubicacion", {
      headers: {
        Authorization: `${token?.value}`,
      },
    }),
  ]);

  const proyectosData = (await proyectos.json()) as IProyecto[];
  const ubicacionesData = (await ubicaciones.json()) as IUbicacion[];

  return (
    <>
      <SearchBar proyectos={proyectosData} ubicaciones={ubicacionesData} />
      <Suspense
        key={q + proyecto_id + ubicacion_id}
        fallback={<DatatableSkeleton />}
      >
        <DataFetch
          token={token?.value}
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
  token?: string;
  proyectos: IProyecto[];
  ubicaciones: IUbicacion[];
  searchParams: { q?: string; proyecto_id?: string; ubicacion_id?: string };
}

const DataFetch = async ({
  token,
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

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const propertiesData = (await response.json()) as IPropiedad[];

  return (
    <PropertiesDataTable
      proyectos={proyectos}
      ubicaciones={ubicaciones}
      propiedades={propertiesData}
    />
  );
};
