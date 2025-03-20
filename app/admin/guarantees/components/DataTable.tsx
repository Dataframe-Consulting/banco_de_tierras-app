"use client";

import Form from "./Form";
import formatCurrency from "@/app/shared/utils/format-currency";
import { PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
import { useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IGarantia, IPropiedad } from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IGarantia | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; data: IGarantia | null };
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

interface IGuaranteesDataTable {
  guarantees: IGarantia[];
  propiedades: IPropiedad[];
}

const GuaranteesDataTable = ({
  guarantees,
  propiedades,
}: IGuaranteesDataTable) => {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: IGarantia | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    guarantees,
    (currentData, data: IGarantia | null) => {
      if (state.action === "add") return [...currentData, data] as IGarantia[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as IGarantia[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as IGarantia[];
      return currentData;
    }
  );

  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: IGarantia) => (
        <div className="flex justify-center gap-2">
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
      name: "Beneficiario",
      maxwidth: "200px",
      selector: (row: { beneficiario: string }) => row.beneficiario,
      sortable: true,
    },
    {
      name: "Monto",
      selector: (row: { monto: number }) => row.monto,
      sortable: true,
      format: (row: { monto: number }) => formatCurrency(row.monto, "MXN"),
    },
    {
      name: "Fecha de inicio",
      selector: (row: { fecha_inicio: Date }) => row.fecha_inicio.toString(),
      sortable: true,
      format: (row: { fecha_inicio: Date }) =>
        formatDateLatinAmerican(row.fecha_inicio),
    },
    {
      name: "Fecha de fin",
      selector: (row: { fecha_fin: Date }) => row.fecha_fin.toString(),
      sortable: true,
      format: (row: { fecha_fin: Date }) =>
        formatDateLatinAmerican(row.fecha_fin),
    },
    {
      name: "Propiedad",
      selector: (row: { propiedad: { nombre: string } }) =>
        row.propiedad.nombre,
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
            propiedades={propiedades}
            garantia={state.selectedData}
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
      {guarantees.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={optimisticData} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron garantías"
          description="No se encontraron garantías en la base de datos."
        />
      )}
    </>
  );
};

export default GuaranteesDataTable;
