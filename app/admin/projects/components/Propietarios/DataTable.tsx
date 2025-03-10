"use client";

import { useEffect, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { Card404, Datatable, DatatableSkeleton } from "@/app/shared/components";
import type { IPropietario } from "@/app/shared/interfaces";

const columns = [
  {
    name: "Nombre",
    selector: (row: { nombre: string }) => row.nombre,
    sortable: true,
    cell: (row: { nombre: string }) => row.nombre,
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

interface IPropietariosDataTable {
  propietarios: IPropietario[];
}

const PropietariosDataTable = ({ propietarios }: IPropietariosDataTable) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {propietarios.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={propietarios} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron propietarios"
          description="No hay propietarios asociadas a este proyecto"
        />
      )}
    </>
  );
};

export default PropietariosDataTable;
