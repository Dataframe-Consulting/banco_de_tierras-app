"use client";

import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useEffect, useState } from "react";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IGarantia } from "@/app/shared/interfaces";

interface IGuaranteesDataTable {
  guarantees: IGarantia[];
  onAction: (data: IGarantia | null, action: "add" | "edit" | "delete") => void;
}

const GuaranteesDataTable = ({ guarantees, onAction }: IGuaranteesDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: IGarantia) => (
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
      name: "Beneficiario",
      selector: (row: { beneficiario: string }) => row.beneficiario,
      sortable: true,
    },
    {
      name: "Monto",
      selector: (row: { monto: number }) => row.monto.toString(),
      sortable: true,
      format: (row: { monto: number }) => `$${row.monto.toLocaleString()}`,
    },
    {
      name: "Fecha Inicio",
      selector: (row: { fecha_inicio: Date }) => row.fecha_inicio.toString(),
      sortable: true,
      format: (row: { fecha_inicio: Date }) =>
        formatDateSimple(row.fecha_inicio),
    },
    {
      name: "Fecha Fin",
      selector: (row: { fecha_fin: Date }) => row.fecha_fin.toString(),
      sortable: true,
      format: (row: { fecha_fin: Date }) =>
        formatDateSimple(row.fecha_fin),
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
      {guarantees.length > 0 ? (
        <>
          {isClient ? (
            <Datatable 
              columns={columns} 
              data={guarantees}
            />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron garantías."
          description="No se encontraron garantías en la base de datos."
        />
      )}
    </div>
  );
};

export default GuaranteesDataTable;
