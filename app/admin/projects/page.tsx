"use client";

import { useState, useEffect, Suspense, useReducer, useOptimistic } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, ProjectsDataTable } from "./components";
import { DatatableSkeleton, PageLayout, AddButton, Modal } from "@/app/shared/components";
import Form from "./components/Form";
import type { 
  IProyecto, 
  ISituacionFisica, 
  IVocacion, 
  IVocacionEspecifica 
} from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IProyecto | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; data: IProyecto | null };
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

const ProjectsContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<IProyecto[]>([]);
  const [situacionesFisicas, setSituacionesFisicas] = useState<ISituacionFisica[]>([]);
  const [vocaciones, setVocaciones] = useState<IVocacion[]>([]);
  const [vocacionesEspecificas, setVocacionesEspecificas] = useState<IVocacionEspecifica[]>([]);
  
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: IProyecto | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    projects,
    (currentData, data: IProyecto | null) => {
      if (state.action === "add") return [...currentData, data] as IProyecto[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as IProyecto[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as IProyecto[];
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
        const [projectsRes, situacionesRes, vocacionesRes, vocacionesEspRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/proyecto?${params.toString()}`, {
            credentials: "include"
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/situacion_fisica`, {
            credentials: "include"
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/vocacion`, {
            credentials: "include"
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/vocacion_especifica`, {
            credentials: "include"
          })
        ]);

        if (projectsRes.ok) {
          const result = await projectsRes.json();
          setProjects(Array.isArray(result) ? result : (result.data || []));
        }

        if (situacionesRes.ok) {
          const result = await situacionesRes.json();
          setSituacionesFisicas(Array.isArray(result) ? result : (result.data || []));
        }

        if (vocacionesRes.ok) {
          const result = await vocacionesRes.json();
          setVocaciones(Array.isArray(result) ? result : (result.data || []));
        }

        if (vocacionesEspRes.ok) {
          const result = await vocacionesEspRes.json();
          setVocacionesEspecificas(Array.isArray(result) ? result : (result.data || []));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
            proyecto={state.selectedData}
            situacionesFisicas={situacionesFisicas}
            vocaciones={vocaciones}
            vocacionesEspecificas={vocacionesEspecificas}
            refresh={() => setRefresh((prev) => !prev)}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
          />
        </Modal>
      )}
      <PageLayout 
        searchBar={
          <SearchBar
            situacionesFisicas={situacionesFisicas}
            vocaciones={vocaciones}
            vocacionesEspecificas={vocacionesEspecificas}
          />
        }
        addButton={
          <AddButton
            label="Añadir Proyecto"
            onClick={() => handleAction(null, "add")}
          />
        }
      >
        {loading ? (
          <DatatableSkeleton />
        ) : (
          <ProjectsDataTable
            projects={optimisticData}
            onAction={handleAction}
          />
        )}
      </PageLayout>
    </>
  );
};

const ProjectsPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <ProjectsContent />
    </Suspense>
  );
};

export default ProjectsPage;
