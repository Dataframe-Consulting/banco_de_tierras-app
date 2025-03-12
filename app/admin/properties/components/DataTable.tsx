"use client";

import Form from "./Form";
import formatCurrency from "@/app/shared/utils/format-currency";
import { ExpanderComponentProps } from "react-data-table-component";
import { PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
import { useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { UbicacionesDataTable, PropertiesLocationsForm } from "./Ubicaciones";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type {
  IProyecto,
  IUbicacion,
  IPropiedad,
} from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IPropiedad | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; data: IPropiedad | null };
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

const ExpandedComponent: React.FC<ExpanderComponentProps<IPropiedad>> = ({
  data,
}) => {
  return (
    <div className="pl-12 py-4">
      <h1 className="text-2xl">
        Ubicaciones de la propiedad: {`"${data.nombre}"`}
      </h1>
      <UbicacionesDataTable
        propiedadId={data.id}
        ubicaciones={data.ubicaciones}
      />
    </div>
  );
};

interface IPropertiesDataTable {
  proyectos: IProyecto[];
  ubicaciones: IUbicacion[];
  propiedades: IPropiedad[];
}

const PropertiesDataTable = ({
  proyectos,
  ubicaciones,
  propiedades,
}: IPropertiesDataTable) => {
  const [isClient, setIsClient] = useState(false);
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
    propiedades,
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

  const columns = [
    {
      name: "Acciones",
      width: "220px",
      cell: (row: IPropiedad) => (
        <div className="flex justify-center gap-2">
          <PropertiesLocationsForm
            action="add"
            propiedadId={row.id}
            ubicacion={ubicaciones.filter(
              (ubicacion) =>
                !row.ubicaciones.map((u) => u.id).includes(ubicacion.id)
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
      maxwidth: "200px",
      selector: (row: { nombre: string }) => row.nombre,
      sortable: true,
    },
    {
      name: "Superficie (m²)",
      selector: (row: { superficie: number }) => row.superficie,
      sortable: true,
    },
    {
      name: "Valor Comercial",
      selector: (row: { valor_comercial: number }) => row.valor_comercial,
      sortable: true,
      format: (row: { valor_comercial: number }) =>
        formatCurrency(row.valor_comercial, "MXN"),
    },
    {
      name: "Año Valor Comercial",
      selector: (row: { anio_valor_comercial?: number }) =>
        row.anio_valor_comercial ?? "N/A",
      sortable: true,
    },
    {
      name: "Clave Catastral",
      selector: (row: { clave_catastral: string }) => row.clave_catastral,
      sortable: true,
    },
    {
      name: "Proyecto",
      selector: (row: { proyecto: { nombre: string } }) => row.proyecto.nombre,
      sortable: true,
    },
    {
      name: "Base Predial",
      selector: (row: { base_predial: number }) => row.base_predial,
      sortable: true,
      format: (row: { base_predial: number }) =>
        formatCurrency(row.base_predial, "MXN"),
    },
    {
      name: "Adeudo Predial",
      selector: (row: { adeudo_predial?: number }) =>
        row.adeudo_predial ?? "N/A",
      sortable: true,
      format: (row: { adeudo_predial?: number }) =>
        row.adeudo_predial ? formatCurrency(row.adeudo_predial, "MXN") : "N/A",
    },
    {
      name: "Años Pend. Predial",
      selector: (row: { anios_pend_predial?: number }) =>
        row.anios_pend_predial ?? "N/A",
      sortable: true,
    },
    {
      name: "Comentarios",
      selector: (row: { comentarios?: string }) =>
        row.comentarios ?? "Sin comentarios",
      wrap: true,
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
            propiedad={state.selectedData}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
            proyectos={proyectos}
            ubicaciones={ubicaciones}
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
      {propiedades.length > 0 ? (
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
          title="No se encontraron propiedades"
          description="No se encontraron propiedades en la base de datos."
        />
      )}
    </>
  );
};

export default PropertiesDataTable;
