"use client";

import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useEffect, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IVocacionEspecifica } from "@/app/shared/interfaces";

interface ISpecificVocationsDataTable {
  specificVocations: IVocacionEspecifica[];
  onAction: (data: IVocacionEspecifica | null, action: "add" | "edit" | "delete") => void;
}

const SpecificVocationsDataTable = ({ specificVocations, onAction }: ISpecificVocationsDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: IVocacionEspecifica) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onAction(row, "edit")}
            className="px-4 py-2 text-white bg-blue-400 rounded-md"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onAction(row, "delete")}
            className="px-4 py-2 text-white bg-red-400 rounded-md"
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
    <div className="h-full">
      {specificVocations.length > 0 ? (
        <>
          {isClient ? (
            <Datatable 
              columns={columns} 
              data={specificVocations}
            />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron vocaciones específicas."
          description="No se encontraron vocaciones específicas en la base de datos."
        />
      )}
    </div>
  );
};

export default SpecificVocationsDataTable;
