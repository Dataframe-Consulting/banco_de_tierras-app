"use client";

import Form from "./Form";
import { ExpanderComponentProps } from "react-data-table-component";
import { PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
import React, { useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IPropietario } from "@/app/shared/interfaces";
import { useModal } from "@/app/shared/hooks";
import { ArchivoForm, ArchivosDataTable } from "../../components/Archivos";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IPropietario | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: {
        action: "add" | "edit" | "delete";
        data: IPropietario | null;
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

interface IOwnersDataTable {
  propietarios: IPropietario[];
  refresh: () => void;
}

const OwnersDataTable = ({ propietarios, refresh }: IOwnersDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });
  const [dataSelected, setDataSelected] = useState<IPropietario | null>(null);

  const handleAction = (
    data: IPropietario | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    propietarios,
    (currentData, data: IPropietario | null) => {
      if (state.action === "add")
        return [...currentData, data] as IPropietario[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as IPropietario[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as IPropietario[];
      return currentData;
    }
  );

  const columns = [
    {
      name: "Acciones",
      width: "200px",
      cell: (row: IPropietario) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setDataSelected(row);
              onOpen();
            }}
            className="px-4 py-2 text-white bg-green-400 rounded-md"
          >
            <PlusCircle />
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
      name: "Nombre",
      selector: (row: { nombre: string }) => row.nombre,
      sortable: true,
    },
    {
      name: "RFC",
      selector: (row: { rfc: string }) => row.rfc,
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

  const ExpandedComponent: React.FC<ExpanderComponentProps<IPropietario>> = ({
    data,
  }) => {
    return (
      <div className="pl-12 py-4">
        <h2 className="text-lg font-bold">Archivos</h2>
        <ArchivosDataTable refresh={refresh} archivos={data.archivos} />
      </div>
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isOpen && dataSelected && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <p className="text-lg font-bold text-center mb-4">Agregar archivos</p>
          <ArchivoForm
            refresh={refresh}
            tabla="propietario"
            tablaId={dataSelected.id}
          />
        </Modal>
      )}
      {state.open && (
        <Modal
          isOpen={state.open}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <Form
            action={state.action}
            propietario={state.selectedData}
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
      {propietarios.length > 0 ? (
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
          title="No se encontraron propietarios."
          description="No se encontraron propietarios en la base de datos."
        />
      )}
    </>
  );
};

export default OwnersDataTable;
