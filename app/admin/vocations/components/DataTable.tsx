"use client";

import Form from "./Form";
import { PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
import { useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IVocacion } from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IVocacion | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: {
        action: "add" | "edit" | "delete";
        data: IVocacion | null;
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

interface IVocationsDataTable {
  vocations: IVocacion[];
  refresh: () => void;
}

const VocationsDataTable = ({ vocations, refresh }: IVocationsDataTable) => {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: IVocacion | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    vocations,
    (currentData, data: IVocacion | null) => {
      if (state.action === "add") return [...currentData, data] as IVocacion[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as IVocacion[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as IVocacion[];
      return currentData;
    }
  );

  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: IVocacion) => (
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
      name: "Valor",
      selector: (row: { valor: string }) => row.valor,
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
            vocacion={state.selectedData}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
            refresh={refresh}
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
      {vocations.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={optimisticData} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron vocaciones."
          description="No se encontraron vocaciones en la base de datos."
        />
      )}
    </>
  );
};

export default VocationsDataTable;
