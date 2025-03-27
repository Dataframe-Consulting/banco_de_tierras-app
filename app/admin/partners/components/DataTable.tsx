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
import type { ISocio } from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: ISocio | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: {
        action: "add" | "edit" | "delete";
        data: ISocio | null;
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

interface IPartnersDataTable {
  partners: ISocio[];
  refresh: () => void;
}

const PartnersDataTable = ({ partners, refresh }: IPartnersDataTable) => {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });

  const handleAction = (
    data: ISocio | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    partners,
    (currentData, data: ISocio | null) => {
      if (state.action === "add") return [...currentData, data] as ISocio[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as ISocio[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as ISocio[];
      return currentData;
    }
  );

  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: ISocio) => (
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
      name: "Nombre",
      selector: (row: { nombre: string }) => row.nombre,
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
            partner={state.selectedData}
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
      {partners.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={optimisticData} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron socios."
          description="No se encontraron socios en la base de datos."
        />
      )}
    </>
  );
};

export default PartnersDataTable;
