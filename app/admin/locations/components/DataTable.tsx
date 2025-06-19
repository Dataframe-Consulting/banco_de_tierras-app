"use client";

import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useEffect, useState } from "react";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IUbicacion } from "@/app/shared/interfaces";

interface ILocationsDataTable {
  locations: IUbicacion[];
  onAction: (data: IUbicacion | null, action: "add" | "edit" | "delete") => void;
}

const LocationsDataTable = ({ locations, onAction }: ILocationsDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: IUbicacion) => (
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
      {locations.length > 0 ? (
        <>
          {isClient ? (
            <Datatable 
              columns={columns} 
              data={locations}
            />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron ubicaciones."
          description="No se encontraron ubicaciones en la base de datos."
        />
      )}
    </div>
  );
};

export default LocationsDataTable;
