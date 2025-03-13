import { Suspense } from "react";
import { cookies } from "next/headers";
import { SearchBar, RentsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { IPropiedad, IRenta } from "@/app/shared/interfaces";

interface IRentsPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const RentsPage = async ({ searchParams }: IRentsPage) => {
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

export default RentsPage;

interface IDataFetch {
  token?: string;
  propiedades: IPropiedad[];
  searchParams: { q?: string; propiedad_id?: string };
}

const DataFetch = async ({ token, searchParams, propiedades }: IDataFetch) => {
  const url = new URL("http://localhost:8000/api/renta");
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);
  if (searchParams.propiedad_id)
    params.append("propiedad_id", searchParams.propiedad_id);

  // const response = await fetch(`${url}?${params.toString()}`, {
  //   headers: {
  //     Authorization: `${token}`,
  //   },
  // });
  // const rentsData = (await response.json()) as IRenta[];
  const rentsData: IRenta[] = [];

  return <RentsDataTable rents={rentsData} propiedades={propiedades} />;
};
