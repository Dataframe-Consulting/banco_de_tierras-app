"use client";

import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useEffect, useState } from "react";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IPropietario } from "@/app/shared/interfaces";

interface IOwnersDataTable {
  propietarios: IPropietario[];
  onAction: (data: IPropietario | null, action: "add" | "edit" | "delete") => void;
}

const OwnersDataTable = ({ propietarios, onAction }: IOwnersDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: IPropietario) => (
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
      {propietarios.length > 0 ? (
        <>
          {isClient ? (
            <Datatable 
              columns={columns} 
              data={propietarios}
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
    </div>
  );
};

export default OwnersDataTable;
