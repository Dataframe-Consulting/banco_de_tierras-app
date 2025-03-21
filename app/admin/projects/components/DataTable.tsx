"use client";

import Form from "./Form";
import { ProjectsOwnersForm, PropietariosDataTable } from "./Propietarios";
import { ExpanderComponentProps } from "react-data-table-component";
import { PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
import { useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type {
  IProyecto,
  IVocacion,
  IPropietario,
  ISituacionFisica,
  IVocacionEspecifica,
} from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IProyecto | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: {
        action: "add" | "edit" | "delete";
        data: IProyecto | null;
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

const ExpandedComponent: React.FC<ExpanderComponentProps<IProyecto>> = ({
  data,
}) => {
  return (
    <div className="pl-12 py-4">
      <PropietariosDataTable
        proyectoId={data.id}
        propietarios={data.propietarios}
      />
    </div>
  );
};

interface IProjectsDataTable {
  projects: IProyecto[];
  vocaciones: IVocacion[];
  propietarios: IPropietario[];
  situacionesFisicas: ISituacionFisica[];
  vocacionesEspecificas: IVocacionEspecifica[];
}

const ProjectsDataTable = ({
  projects,
  vocaciones,
  propietarios,
  situacionesFisicas,
  vocacionesEspecificas,
}: IProjectsDataTable) => {
  const [isClient, setIsClient] = useState(false);
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

  const columns = [
    {
      name: "Acciones",
      width: "220px",
      cell: (row: IProyecto) => (
        <div className="flex justify-center gap-2">
          <ProjectsOwnersForm
            action="add"
            proyectoId={row.id}
            propietario={propietarios.filter(
              (propietario) =>
                !row.propietarios.map(({ id }) => id).includes(propietario.id)
            )}
          />
          <button
            onClick={() => handleAction(row, "edit")}
            className="px-4 py-2 text-white bg-blue-400 rounded-md"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => handleAction(row, "delete")}
            className="px-4 py- text-white bg-red-400 rounded-md"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
    {
      name: "Nombre",
      selector: (row: { nombre: string }) => row.nombre,
      sortable: true,
    },
    {
      name: "Superficie Total (m²)",
      selector: (row: { superficie_total: number }) => row.superficie_total,
      sortable: true,
    },
    {
      name: "Activo",
      selector: (row: { esta_activo: boolean }) => row.esta_activo,
      sortable: true,
      format: (row: { esta_activo: boolean }) =>
        row.esta_activo ? "Sí" : "No",
    },
    {
      name: "Comentarios",
      selector: (row: { comentarios?: string }) =>
        row.comentarios ?? "Sin comentarios",
      sortable: true,
      wrap: true,
    },
    {
      name: "Situación Física",
      selector: (row: { situacion_fisica: { nombre: string } }) =>
        row.situacion_fisica.nombre,
      sortable: true,
    },
    {
      name: "Vocación",
      selector: (row: { vocacion: { valor: string } }) => row.vocacion.valor,
      sortable: true,
    },
    {
      name: "Vocación Específica",
      selector: (row: { vocacion_especifica: { valor: string } }) =>
        row.vocacion_especifica.valor,
      sortable: true,
    },
    {
      name: "Creado en",
      selector: (row: { created_at: Date }) => row.created_at.toString(),
      sortable: true,
      format: (row: { created_at: Date }) =>
        formatDateLatinAmerican(row.created_at),
    },
    {
      name: "Actualizado en",
      selector: (row: { updated_at: Date }) => row.updated_at.toString(),
      sortable: true,
      format: (row: { updated_at: Date }) =>
        formatDateLatinAmerican(row.updated_at),
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            vocaciones={vocaciones}
            propietarios={propietarios}
            situacionesFisicas={situacionesFisicas}
            vocacionesEspecificas={vocacionesEspecificas}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
          />
        </Modal>
      )}
      <div className="w-full text-right">
        <button
          onClick={() => handleAction(null, "add")}
          className="px-4 py-2 text-white bg-green-400 rounded-md"
        >
          <PlusCircle />
        </button>
      </div>
      {projects.length > 0 ? (
        <>
          {isClient ? (
            <Datatable
              columns={columns}
              data={optimisticData}
              isExpandable
              expandableRowsComponent={(props) => (
                <ExpandedComponent {...props} />
              )}
            />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron proyectos"
          description="No se encontraron proyectos en la base de datos."
        />
      )}
    </>
  );
};

export default ProjectsDataTable;
