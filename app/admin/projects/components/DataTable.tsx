"use client";

import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useEffect, useState } from "react";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IProyecto } from "@/app/shared/interfaces";

interface IProjectsDataTable {
  projects: IProyecto[];
  onAction: (data: IProyecto | null, action: "add" | "edit" | "delete") => void;
}

const ProjectsDataTable = ({ projects, onAction }: IProjectsDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "100px",
      cell: (row: IProyecto) => (
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
      name: "Nombre",
      selector: (row: { nombre: string }) => row.nombre,
      sortable: true,
    },
    {
      name: "Superficie Total",
      selector: (row: { superficie_total: number }) => row.superficie_total.toString(),
      sortable: true,
      format: (row: { superficie_total: number }) => `${row.superficie_total.toLocaleString()} m²`,
    },
    {
      name: "Estado",
      selector: (row: { esta_activo: boolean }) => row.esta_activo.toString(),
      sortable: true,
      format: (row: { esta_activo: boolean }) => row.esta_activo ? "Activo" : "Inactivo",
    },
    {
      name: "Situación Física",
      selector: (row: { situacion_fisica: { nombre: string } }) => row.situacion_fisica.nombre,
      sortable: true,
    },
    {
      name: "Vocación",
      selector: (row: { vocacion: { valor: string } }) => row.vocacion.valor,
      sortable: true,
    },
    {
      name: "Vocación Específica",
      selector: (row: { vocacion_especifica: { valor: string } }) => row.vocacion_especifica.valor,
      sortable: true,
    },
    {
      name: "Creado en",
      selector: (row: { created_at: Date }) => row.created_at.toString(),
      sortable: true,
      format: (row: { created_at: Date }) =>
        formatDateSimple(row.created_at),
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-full">
      {projects.length > 0 ? (
        <>
          {isClient ? (
            <Datatable 
              columns={columns} 
              data={projects}
            />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron proyectos."
          description="No se encontraron proyectos en la base de datos."
        />
      )}
    </div>
  );
};

export default ProjectsDataTable;
