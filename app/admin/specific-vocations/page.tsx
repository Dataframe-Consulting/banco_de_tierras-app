import { Suspense } from "react";
import { cookies } from "next/headers";
import { DatatableSkeleton } from "@/app/shared/components";
import { SearchBar, SpecificVocationsDataTable } from "./components";
import type { IVocacionEspecifica } from "@/app/shared/interfaces";

interface ISpecificVocationsPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const SpecificVocationsPage = async ({
  searchParams,
}: ISpecificVocationsPage) => {
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

export default SpecificVocationsPage;

interface IDataFetch {
  token?: string;
  searchParams: { q?: string };
}

const DataFetch = async ({ token, searchParams }: IDataFetch) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/vocacion_especifica`);
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const specificVocationsData =
    (await response.json()) as IVocacionEspecifica[];

  return (
    <SpecificVocationsDataTable specificVocations={specificVocationsData} />
  );
};
