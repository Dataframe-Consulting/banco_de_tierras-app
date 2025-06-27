"use client";

import { useState, useEffect, Suspense, useReducer, useOptimistic } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, LocationsDataTable } from "./components";
import { DatatableSkeleton, PageLayout, AddButton, Modal } from "@/app/shared/components";
import Form from "./components/Form";
import type { IUbicacion } from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IUbicacion | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; data: IUbicacion | null };
    }
  | { type: "CLOSE_MODAL" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        open: true,
        action: action.payload.action,
        selectedData: action.payload.data,
      };
    case "CLOSE_MODAL":
      return { ...state, open: false };
    default:
      return state;
  }
};

const LocationsContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<IUbicacion[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: IUbicacion | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    locations,
    (currentData, data: IUbicacion | null) => {
      if (state.action === "add") return [...currentData, data] as IUbicacion[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as IUbicacion[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as IUbicacion[];
      return currentData;
    }
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const searchParamsObj = Object.fromEntries(searchParams.entries());
      const params = new URLSearchParams(searchParamsObj);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ubicacion?${params.toString()}`, {
          credentials: "include"
        });
        if (response.ok) {
          const result = await response.json();
          setLocations(Array.isArray(result) ? result : (result.data || []));
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, refresh]);

  return (
    <>
      {state.open && (
        <Modal
          isOpen={state.open}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <Form
            action={state.action}
            location={state.selectedData}
            refresh={() => setRefresh((prev) => !prev)}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
          />
        </Modal>
      )}
      <PageLayout 
        searchBar={<SearchBar />}
        addButton={
          <AddButton
            label="Añadir Ubicación"
            onClick={() => handleAction(null, "add")}
          />
        }
      >
        {loading ? (
          <DatatableSkeleton />
        ) : (
          <LocationsDataTable
            locations={optimisticData}
            onAction={handleAction}
          />
        )}
      </PageLayout>
    </>
  );
};

const LocationsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <LocationsContent />
    </Suspense>
  );
};

export default LocationsPage;
