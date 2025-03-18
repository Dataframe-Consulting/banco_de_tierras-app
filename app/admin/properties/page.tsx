import { Suspense } from "react";
import { cookies } from "next/headers";
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

interface IPropertiesPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const PropertiesPage = async ({ searchParams }: IPropertiesPage) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const {
    q = "",
    garanta_id = "",
    proyecto_id = "",
    sociedad_id = "",
    ubicacion_id = "",
    proceso_legal_id = "",
  } = (await searchParams) || {};

  const searchParamsForDatatable = {
    q,
    garanta_id,
    proyecto_id,
    sociedad_id,
    ubicacion_id,
    proceso_legal_id,
  };

  const [proyectos, sociedades, ubicaciones, garantias, procesos_legales] =
    await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/proyecto`, {
        headers: {
          Authorization: `${token?.value}`,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sociedad`, {
        headers: {
          Authorization: `${token?.value}`,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/ubicacion`, {
        headers: {
          Authorization: `${token?.value}`,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/garantia`, {
        headers: {
          Authorization: `${token?.value}`,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/proceso_legal`, {
        headers: {
          Authorization: `${token?.value}`,
        },
      }),
    ]);

  const proyectosData = (await proyectos.json()) as IProyecto[];
  const garantiasData = (await garantias.json()) as IGarantia[];
  const sociedadesData = (await sociedades.json()) as ISociedad[];
  const ubicacionesData = (await ubicaciones.json()) as IUbicacion[];
  const procesosLegalesData =
    (await procesos_legales.json()) as IProcesoLegal[];

  return (
    <>
      <SearchBar
        proyectos={proyectosData}
        garantias={garantiasData}
        sociedades={sociedadesData}
        ubicaciones={ubicacionesData}
        procesosLegales={procesosLegalesData}
      />
      <Suspense
        key={
          q +
          garanta_id +
          proyecto_id +
          sociedad_id +
          ubicacion_id +
          proceso_legal_id
        }
        fallback={<DatatableSkeleton />}
      >
        <DataFetch
          token={token?.value}
          proyectos={proyectosData}
          garantias={garantiasData}
          sociedades={sociedadesData}
          ubicaciones={ubicacionesData}
          procesosLegales={procesosLegalesData}
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
  garantias: IGarantia[];
  sociedades: ISociedad[];
  ubicaciones: IUbicacion[];
  procesosLegales: IProcesoLegal[];
  searchParams: {
    q?: string;
    garantia_id?: string;
    proyecto_id?: string;
    sociedad_id?: string;
    ubicacion_id?: string;
    proceso_legal_id?: string;
  };
}

const DataFetch = async ({
  token,
  proyectos,
  garantias,
  sociedades,
  ubicaciones,
  searchParams,
  procesosLegales,
}: IDataFetch) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/propiedad`);
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);
  if (searchParams.proyecto_id)
    params.append("proyecto_id", searchParams.proyecto_id);
  if (searchParams.garantia_id)
    params.append("garantia_id", searchParams.garantia_id);
  if (searchParams.sociedad_id)
    params.append("sociedad_id", searchParams.sociedad_id);
  if (searchParams.ubicacion_id)
    params.append("ubicacion_id", searchParams.ubicacion_id);
  if (searchParams.proceso_legal_id)
    params.append("proceso_legal_id", searchParams.proceso_legal_id);

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const propertiesData = (await response.json()) as IPropiedad[];

  return (
    <PropertiesDataTable
      garantias={garantias}
      proyectos={proyectos}
      sociedades={sociedades}
      ubicaciones={ubicaciones}
      propiedades={propertiesData}
      procesosLegales={procesosLegales}
    />
  );
};
