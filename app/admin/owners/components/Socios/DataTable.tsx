"use client";

import OwnersPartnersForm from "./Form";
import { useEffect, useState } from "react";
import { Card404, Datatable, DatatableSkeleton } from "@/app/shared/components";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import type { ISocio } from "@/app/shared/interfaces";

interface ISociosDataTable {
  propietarioId: number;
  socios: ISocio[];
}

const SociosDataTable = ({ propietarioId, socios }: ISociosDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "90px",
      cell: (row: ISocio) => (
        <div className="flex justify-center gap-2">
          <OwnersPartnersForm
            action="delete"
            propietarioId={propietarioId}
            socio={row}
          />
        </div>
      ),
    },
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {socios.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={socios} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron socios"
          description="No hay socios asociados a este propietario"
        />
      )}
    </>
  );
};

export default SociosDataTable;
