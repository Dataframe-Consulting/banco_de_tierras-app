"use client";

import { useEffect, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { Card404, Datatable, DatatableSkeleton } from "@/app/shared/components";
import type { IPropietario } from "@/app/shared/interfaces";
import ProjectsOwnersForm from "./Form";

interface IPropietariosDataTable {
  proyectoId: number;
  propietarios: IPropietario[];
  refresh: () => void;
}

const PropietariosDataTable = ({
  proyectoId,
  propietarios,
  refresh,
}: IPropietariosDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "90px",
      cell: (row: IPropietario) => (
        <div className="flex justify-center gap-2">
          <ProjectsOwnersForm
            action="delete"
            propietario={row}
            proyectoId={proyectoId}
            refresh={refresh}
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
