import { Suspense } from "react";
import { cookies } from "next/headers";
import { DatatableSkeleton } from "@/app/shared/components";
import { SearchBar, GuaranteesDataTable } from "./components";
import type { IPropiedad, IGarantia } from "@/app/shared/interfaces";

interface IGuaranteesPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const GuaranteesPage = async ({ searchParams }: IGuaranteesPage) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const { q = "", propiedad_id = "" } = (await searchParams) || {};

  const searchParamsForDataTable = { q, propiedad_id };

  // const propiedades = await fetch("http://localhost:8000/api/propiedad", {
  //   headers: {
  //     Authorization: `${token?.value}`,
  //   },
  // });
  // const propiedadesData = (await propiedades.json()) as IPropiedad[];
  const propiedadesData: IPropiedad[] = [];

  return (
    <>
      <SearchBar propiedades={propiedadesData} />
      <Suspense key={q} fallback={<DatatableSkeleton />}>
        <DataFetch
          token={token?.value}
          propiedades={propiedadesData}
          searchParams={searchParamsForDataTable}
        />
      </Suspense>
    </>
  );
};

export default GuaranteesPage;

interface IDataFetch {
  token?: string;
  propiedades: IPropiedad[];
  searchParams: { q?: string; propiedad_id?: string };
}

const DataFetch = async ({ token, searchParams, propiedades }: IDataFetch) => {
  const url = new URL("http://localhost:8000/api/garantia");
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);
  if (searchParams.propiedad_id)
    params.append("propiedad_id", searchParams.propiedad_id);

  // const response = await fetch(`${url}?${params.toString()}`, {
  //   headers: {
  //     Authorization: `${token}`,
  //   },
  // });
  // const guaranteesData = (await response.json()) as IGarantia[];
  const guaranteesData: IGarantia[] = [];

  return (
    <GuaranteesDataTable
      propiedades={propiedades}
      guarantees={guaranteesData}
    />
  );
};
