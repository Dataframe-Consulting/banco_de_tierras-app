"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useReducer, useOptimistic } from "react";
import { DatatableSkeleton, PageLayout, AddButton, Modal } from "@/app/shared/components";
import { PropertiesDataTable, SearchBar } from "./components";
import Form from "./components/Form";
import type {
  IGarantia,
  IProyecto,
  IUbicacion,
  IPropiedad,
  IPropietario,
  IProcesoLegal,
} from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IPropiedad | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: {
        action: "add" | "edit" | "delete";
        data: IPropiedad | null;
      };
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

const PropertiesPageContent = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [properties, setProperties] = useState<IPropiedad[]>([]);
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [propietarios, setPropietarios] = useState<IPropietario[]>([]);
  const [ubicaciones, setUbicaciones] = useState<IUbicacion[]>([]);
  const [garantias, setGarantias] = useState<IGarantia[]>([]);
  const [procesosLegales, setProcesosLegales] = useState<IProcesoLegal[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: IPropiedad | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    properties,
    (currentData, data: IPropiedad | null) => {
      if (state.action === "add") return [...currentData, data] as IPropiedad[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as IPropiedad[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as IPropiedad[];
      return currentData;
    }
  );

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const garantia_id = searchParams.get("garantia_id") || "";
  const proyecto_id = searchParams.get("proyecto_id") || "";
  const propietario_id = searchParams.get("propietario_id") || "";
  const ubicacion_id = searchParams.get("ubicacion_id") || "";
  const proceso_legal_id = searchParams.get("proceso_legal_id") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const fetchWithAuth = async (endpoint: string) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
            { credentials: "include" }
          );
          return response.json();
        };

        const [
          proyectosData,
          propietariosData,
          ubicacionesData,
          garantiasData,
          procesosLegalesData,
        ] = await Promise.all([
          fetchWithAuth("proyecto/"),
          fetchWithAuth("propietario/"),
          fetchWithAuth("ubicacion/"),
          fetchWithAuth("garantia/"),
          fetchWithAuth("proceso_legal/"),
        ]);
        setProyectos(proyectosData);
        setPropietarios(propietariosData);
        setUbicaciones(ubicacionesData);
        setGarantias(garantiasData);
        setProcesosLegales(procesosLegalesData);

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/propiedad/`);
        const params = new URLSearchParams();

        if (q) params.append("q", q);
        if (garantia_id) params.append("garantia_id", garantia_id);
        if (proyecto_id) params.append("proyecto_id", proyecto_id);
        if (propietario_id) params.append("propietario_id", propietario_id);
        if (ubicacion_id) params.append("ubicacion_id", ubicacion_id);
        if (proceso_legal_id)
          params.append("proceso_legal_id", proceso_legal_id);

        const propertiesResponse = await fetch(`${url}?${params.toString()}`, {
          credentials: "include",
        });
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    q,
    garantia_id,
    proyecto_id,
    propietario_id,
    ubicacion_id,
    proceso_legal_id,
    refresh,
  ]);

  return (
    <>
      {state.open && (
        <Modal
          isOpen={state.open}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <Form
            action={state.action}
            proyectos={proyectos}
            garantias={garantias}
            propietarios={propietarios}
            ubicaciones={ubicaciones}
            procesosLegales={procesosLegales}
            propiedad={state.selectedData}
            refresh={() => setRefresh((prev) => !prev)}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
          />
        </Modal>
      )}
      <PageLayout
        searchBar={
          <SearchBar
            proyectos={proyectos}
            garantias={garantias}
            propietarios={propietarios}
            ubicaciones={ubicaciones}
            procesosLegales={procesosLegales}
          />
        }
        addButton={
          <AddButton
            label="Añadir Propiedad"
            onClick={() => handleAction(null, "add")}
          />
        }
      >
        {loading ? (
          <DatatableSkeleton />
        ) : (
          <PropertiesDataTable
            propiedades={optimisticData}
            onAction={handleAction}
          />
        )}
      </PageLayout>
    </>
  );
};

const PropertiesPage = () => {
  return (
    <Suspense fallback={<DatatableSkeleton />}>
      <PropertiesPageContent />
    </Suspense>
  );
};

export default PropertiesPage;
