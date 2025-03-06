"use client";

import { useEffect, useState } from "react";
import { IUbicacion } from "@/app/shared/interfaces";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { Card404, Datatable, DatatableSkeleton } from "@/app/shared/components";

const columns = [
  {
    name: "Nombre",
    selector: (row: { nombre: string }) => row.nombre,
    sortable: true,
    cell: (row: { nombre: string }) => row.nombre,
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

interface IUbicacionesDataTable {
  ubicaciones: IUbicacion[];
}

const UbicacionesDataTable = ({ ubicaciones }: IUbicacionesDataTable) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {ubicaciones.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={ubicaciones} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron ubicaciones"
          description="No hay ubicaciones asociadas a esta ubicación"
        />
      )}
    </>
  );
};

export default UbicacionesDataTable;
