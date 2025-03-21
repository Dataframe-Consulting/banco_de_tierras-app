import { Suspense } from "react";
import { cookies } from "next/headers";
import { DatatableSkeleton } from "@/app/shared/components";
import { SearchBar, LocationsDataTable } from "./components";
import type { IUbicacion } from "@/app/shared/interfaces";

interface ILocationsPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const LocationsPage = async ({ searchParams }: ILocationsPage) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const { q = "" } = (await searchParams) || {};

  const searchParamsForDataTable = { q };

  return (
    <>
      <SearchBar />
      <Suspense key={q} fallback={<DatatableSkeleton />}>
        <DataFetch
          token={token?.value}
          searchParams={searchParamsForDataTable}
        />
      </Suspense>
    </>
  );
};

export default LocationsPage;

interface IDataFetch {
  token?: string;
  searchParams: { q?: string };
}

const DataFetch = async ({ token, searchParams }: IDataFetch) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ubicacion`);
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const locationsData = (await response.json()) as IUbicacion[];

  return <LocationsDataTable locations={locationsData} />;
};
