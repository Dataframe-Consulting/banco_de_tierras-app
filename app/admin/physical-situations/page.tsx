"use client";

import { useState, useEffect, Suspense, useReducer, useOptimistic } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, PhysicalSituationsDataTable } from "./components";
import { DatatableSkeleton, PageLayout, AddButton, Modal } from "@/app/shared/components";
import Form from "./components/Form";
import type { ISituacionFisica } from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: ISituacionFisica | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; data: ISituacionFisica | null };
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

const PhysicalSituationsContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [physicalSituations, setPhysicalSituations] = useState<ISituacionFisica[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: ISituacionFisica | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    physicalSituations,
    (currentData, data: ISituacionFisica | null) => {
      if (state.action === "add") return [...currentData, data] as ISituacionFisica[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as ISituacionFisica[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as ISituacionFisica[];
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
        const response = await fetch(
          `/api/situaciones-fisicas?${params.toString()}`
        );
        if (response.ok) {
          const result = await response.json();
          setPhysicalSituations(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching physical situations:", error);
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
            situacionFisica={state.selectedData}
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
            label="Añadir Situación Física"
            onClick={() => handleAction(null, "add")}
          />
        }
      >
        {loading ? (
          <DatatableSkeleton />
        ) : (
          <PhysicalSituationsDataTable
            physicalSituations={optimisticData}
            onAction={handleAction}
          />
        )}
      </PageLayout>
    </>
  );
};

const PhysicalSituationsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <PhysicalSituationsContent />
    </Suspense>
  );
};

export default PhysicalSituationsPage;
