"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SearchBar, LocationsDataTable } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { IUbicacion } from "@/app/shared/interfaces";

const LocationsPageContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<IUbicacion[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ubicacion/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);

        const response = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const locationsData = await response.json();
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  return (
    <>
      <SearchBar />
      {loading ? (
        <DatatableSkeleton />
      ) : (
        <LocationsDataTable locations={locations} />
      )}
    </>
  );
};

const LocationsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <LocationsPageContent />
    </Suspense>
  );
};

export default LocationsPage;
