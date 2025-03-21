import { Suspense } from "react";
import { cookies } from "next/headers";
import { DatatableSkeleton } from "@/app/shared/components";
import { SearchBar, VocationsDataTable } from "./components";
import type { IVocacion } from "@/app/shared/interfaces";

interface IVocationsPage {
  searchParams?: Promise<{ [key: string]: string }>;
}

const VocationsPage = async ({ searchParams }: IVocationsPage) => {
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

export default VocationsPage;

interface IDataFetch {
  token?: string;
  searchParams: { q?: string };
}

const DataFetch = async ({ token, searchParams }: IDataFetch) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/vocacion`);
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  const vocationsData = (await response.json()) as IVocacion[];

  return <VocationsDataTable vocations={vocationsData} />;
};
