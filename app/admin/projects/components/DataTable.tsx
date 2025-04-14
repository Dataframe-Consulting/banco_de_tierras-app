"use client";

import Form from "./Form";
import { PropertiesDataTable } from "./Propiedades";
import { ExpanderComponentProps } from "react-data-table-component";
import { EyeIcon, PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
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
  ISituacionFisica,
  IVocacionEspecifica,
} from "@/app/shared/interfaces";
import formatCurrency from "@/app/shared/utils/format-currency";

interface State {
  open: boolean;
  action: "view" | "add" | "edit" | "delete";
  selectedData: IProyecto | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: {
        action: "view" | "add" | "edit" | "delete";
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

interface IProjectsDataTable {
  projects: IProyecto[];
  vocaciones: IVocacion[];
  situacionesFisicas: ISituacionFisica[];
  vocacionesEspecificas: IVocacionEspecifica[];
  refresh: () => void;
}

const ProjectsDataTable = ({
  projects,
  vocaciones,
  situacionesFisicas,
  vocacionesEspecificas,
  refresh,
}: IProjectsDataTable) => {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: IProyecto | null,
    action: "view" | "add" | "edit" | "delete"
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
      width: "200px",
      cell: (row: IProyecto) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleAction(row, "view")}
            className="px-4 py-2 text-white bg-gray-400 rounded-md"
          >
            <EyeIcon />
          </button>
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
      width: "200px",
      name: "Nombre",
      selector: (row: { nombre: string }) => row.nombre,
      sortable: true,
    },
    {
      width: "180px",
      name: "Superficie Total (m²)",
      selector: (row: { superficie_total: number }) => row.superficie_total,
      sortable: true,
    },
    {
      name: "¿Está Activo?",
      selector: (row: { esta_activo: boolean }) => row.esta_activo,
      sortable: true,
      format: (row: { esta_activo: boolean }) =>
        row.esta_activo ? "Sí" : "No",
    },
    {
      width: "400px",
      name: "Comentarios",
      selector: (row: { comentarios?: string }) =>
        row.comentarios ?? "Sin comentarios",
      sortable: true,
      wrap: true,
    },
    {
      width: "150px",
      name: "Situación Física",
      selector: (row: { situacion_fisica: { nombre: string } }) =>
        row.situacion_fisica.nombre,
      sortable: true,
    },
    {
      widthL: "250px",
      name: "Vocación",
      selector: (row: { vocacion: { valor: string } }) => row.vocacion.valor,
      sortable: true,
    },
    {
      widthL: "350px",
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

  const ExpandedComponent: React.FC<ExpanderComponentProps<IProyecto>> = ({
    data,
  }) => {
    return (
      <div className="pl-12 py-4">
        <h2 className="text-lg font-bold">Propiedades</h2>
        <PropertiesDataTable propiedades={data.propiedades} />
      </div>
    );
  };

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
          {state.action !== "view" ? (
            <Form
              action={state.action}
              proyecto={state.selectedData}
              vocaciones={vocaciones}
              situacionesFisicas={situacionesFisicas}
              vocacionesEspecificas={vocacionesEspecificas}
              setOptimisticData={setOptimisticData}
              onClose={() => dispatch({ type: "CLOSE_MODAL" })}
              refresh={refresh}
            />
          ) : (
            <FullDetails proyecto={state.selectedData!} />
          )}
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

interface IFullDetails {
  proyecto: IProyecto;
}

const FullDetails = ({ proyecto }: IFullDetails) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800">{proyecto.nombre}</h2>
      <p className="text-sm text-gray-500">{proyecto.comentarios}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700 mt-4">
        <div>
          <span className="font-semibold">Superficie total:</span>{" "}
          {proyecto.superficie_total.toLocaleString()} m²
        </div>
        <div>
          <span className="font-semibold">Situación física:</span>{" "}
          {proyecto.situacion_fisica?.nombre}
        </div>
        <div>
          <span className="font-semibold">Vocación:</span>{" "}
          {proyecto.vocacion?.valor}
        </div>
        <div>
          <span className="font-semibold">Vocación específica:</span>{" "}
          {proyecto.vocacion_especifica?.valor}
        </div>
        <div>
          <span className="font-semibold">Estado:</span>{" "}
          {proyecto.esta_activo ? "Activo" : "Inactivo"}
        </div>
        <div>
          <span className="font-semibold">ID:</span> {proyecto.id}
        </div>
      </div>

      {proyecto.propiedades?.length > 0 && (
        <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Propiedades
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Superficie</th>
                  <th className="px-4 py-2 text-left">Valor Comercial</th>
                  <th className="px-4 py-2 text-left">Clave Catastral</th>
                  <th className="px-4 py-2 text-left">Base Predial</th>
                  <th className="px-4 py-2 text-left">Adeudo</th>
                  <th className="px-4 py-2 text-left">Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {proyecto.propiedades.map((prop) => (
                  <tr key={prop.id} className="border-t">
                    <td className="px-4 py-2">{prop.nombre}</td>
                    <td className="px-4 py-2">{prop.superficie} m²</td>
                    <td className="px-4 py-2">
                      ${prop.valor_comercial?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{prop.clave_catastral}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(prop.base_predial, "MXN")}
                    </td>
                    <td className="px-4 py-2">
                      {prop.adeudo_predial
                        ? `${formatCurrency(prop.adeudo_predial, "MXN")}`
                        : "—"}
                    </td>
                    <td className="px-4 py-2">{prop.comentarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
