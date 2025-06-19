"use client";

import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useEffect, useState } from "react";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IVocacion } from "@/app/shared/interfaces";

interface IVocationsDataTable {
  vocations: IVocacion[];
  onAction: (data: IVocacion | null, action: "add" | "edit" | "delete") => void;
}

const VocationsDataTable = ({ vocations, onAction }: IVocationsDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "100px",
      cell: (row: IVocacion) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onAction(row, "edit")}
            className="p-2 text-white bg-blue-400 rounded-md"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onAction(row, "delete")}
            className="p-2 text-white bg-red-400 rounded-md"
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
        formatDateSimple(row.created_at),
    },
    {
      name: "Actualizado en",
      selector: (row: { updated_at: Date }) => row.updated_at.toString(),
      sortable: true,
      format: (row: { updated_at: Date }) =>
        formatDateSimple(row.updated_at),
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-full">
      {vocations.length > 0 ? (
        <>
          {isClient ? (
            <Datatable 
              columns={columns} 
              data={vocations}
            />
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
    </div>
  );
};

export default VocationsDataTable;
