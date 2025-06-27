"use client";

import { useState, useEffect, Suspense, useReducer, useOptimistic } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, SpecificVocationsDataTable } from "./components";
import { DatatableSkeleton, PageLayout, AddButton, Modal } from "@/app/shared/components";
import Form from "./components/Form";
import type { IVocacionEspecifica } from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IVocacionEspecifica | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; data: IVocacionEspecifica | null };
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

const SpecificVocationsContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [specificVocations, setSpecificVocations] = useState<IVocacionEspecifica[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: IVocacionEspecifica | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    specificVocations,
    (currentData, data: IVocacionEspecifica | null) => {
      if (state.action === "add") return [...currentData, data] as IVocacionEspecifica[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as IVocacionEspecifica[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as IVocacionEspecifica[];
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
          `${process.env.NEXT_PUBLIC_API_URL}/vocacion_especifica?${params.toString()}`,
          { credentials: "include" }
        );
        if (response.ok) {
          const result = await response.json();
          setSpecificVocations(Array.isArray(result) ? result : (result.data || []));
        }
      } catch (error) {
        console.error("Error fetching specific vocations:", error);
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
            specificVocation={state.selectedData}
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
            label="Añadir Vocación Específica"
            onClick={() => handleAction(null, "add")}
          />
        }
      >
        {loading ? (
          <DatatableSkeleton />
        ) : (
          <SpecificVocationsDataTable
            specificVocations={optimisticData}
            onAction={handleAction}
          />
        )}
      </PageLayout>
    </>
  );
};

const SpecificVocationsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <SpecificVocationsContent />
    </Suspense>
  );
};

export default SpecificVocationsPage;
