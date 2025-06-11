"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useReducer, useOptimistic } from "react";
import { SearchBar, RentsDataTable } from "./components";
import { DatatableSkeleton, PageLayout, AddButton, Modal } from "@/app/shared/components";
import Form from "./components/Form";
import type { IPropiedad, IProyecto, IRenta } from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedRenta: IRenta | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; renta: IRenta | null };
    }
  | { type: "CLOSE_MODAL" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        open: true,
        action: action.payload.action,
        selectedRenta: action.payload.renta,
      };
    case "CLOSE_MODAL":
      return { ...state, open: false };
    default:
      return state;
  }
};

const RentsPageContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rentsData, setRentsData] = useState<IRenta[]>([]);
  const [propiedades, setPropiedades] = useState<IPropiedad[]>([]);
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedRenta: null,
  });

  const handleAction = (
    renta: IRenta | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, renta } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    rentsData,
    (currentData, renta: IRenta | null) => {
      if (state.action === "add") return [...currentData, renta] as IRenta[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === renta?.id ? renta : i
        ) as IRenta[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== renta?.id) as IRenta[];
      return currentData;
    }
  );

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const propiedad_id = searchParams.get("propiedad_id") || "";
  const proyecto_id = searchParams.get("proyecto_id") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const propiedadesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/propiedad/`,
          {
            credentials: "include",
          }
        );
        const propiedadesData = await propiedadesResponse.json();
        setPropiedades(propiedadesData);

        const proyectosResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/proyecto/`,
          {
            credentials: "include",
          }
        );
        const proyectosData = await proyectosResponse.json();
        setProyectos(proyectosData);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/renta/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);
        if (propiedad_id) params.append("propiedad_id", propiedad_id);
        if (proyecto_id) params.append("proyecto_id", proyecto_id);

        const rentsResponse = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const rentsData = await rentsResponse.json();
        setRentsData(rentsData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, propiedad_id, proyecto_id, refresh]);

  return (
    <>
      {state.open && (
        <Modal
          isOpen={state.open}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <Form
            action={state.action}
            propiedades={propiedades}
            renta={state.selectedRenta}
            refresh={() => setRefresh((prev) => !prev)}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
          />
        </Modal>
      )}
      <PageLayout
        searchBar={
          <SearchBar propiedades={propiedades} proyectos={proyectos} />
        }
        addButton={
          <AddButton
            label="Añadir Renta"
            onClick={() => handleAction(null, "add")}
          />
        }
      >
        {loading ? (
          <DatatableSkeleton />
        ) : (
          <RentsDataTable
            rents={optimisticData}
            propiedades={propiedades}
            refresh={() => setRefresh((prev) => !prev)}
            onAction={handleAction}
          />
        )}
      </PageLayout>
    </>
  );
};

const RentsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <RentsPageContent />
    </Suspense>
  );
};

export default RentsPage;
