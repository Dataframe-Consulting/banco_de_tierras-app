import { Suspense } from "react";
import { cookies } from "next/headers";
import { DatatableSkeleton } from "@/app/shared/components";
import { SearchBar, OwnersDataTable } from "./components";
import type { ISocio, IPropietario } from "@/app/shared/interfaces";

interface ILegalProcessesPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const LegalProcessesPage = async ({ searchParams }: ILegalProcessesPage) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const { q = "", socio_id = "" } = (await searchParams) || {};

  const searchParamsForDataTable = { q, socio_id };

  const socios = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/socio`, {
    headers: {
      Authorization: `${token?.value}`,
    },
  });
  const sociosData = (await socios.json()) as ISocio[];

  return (
    <>
      <SearchBar socios={sociosData} />
      <Suspense key={q} fallback={<DatatableSkeleton />}>
        <DataFetch
          token={token?.value}
          socios={sociosData}
          searchParams={searchParamsForDataTable}
        />
      </Suspense>
    </>
  );
};

export default LegalProcessesPage;

interface IDataFetch {
  token?: string;
  socios: ISocio[];
  searchParams: { q?: string; socio_id?: string };
}

const DataFetch = async ({ token, searchParams, socios }: IDataFetch) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/propietario`);
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);
  if (searchParams.socio_id) params.append("socio_id", searchParams.socio_id);

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const propietariosData = (await response.json()) as IPropietario[];

  return <OwnersDataTable socios={socios} propietarios={propietariosData} />;
};
