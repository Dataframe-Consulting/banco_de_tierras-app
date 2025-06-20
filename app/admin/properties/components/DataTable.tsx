"use client";

import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useEffect, useState } from "react";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import formatCurrency from "@/app/shared/utils/format-currency";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IPropiedad } from "@/app/shared/interfaces";

interface IPropertiesDataTable {
  propiedades: IPropiedad[];
  onAction: (data: IPropiedad | null, action: "add" | "edit" | "delete") => void;
}

const PropertiesDataTable = ({ propiedades, onAction }: IPropertiesDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "100px",
      cell: (row: IPropiedad) => (
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
      name: "Superficie",
      selector: (row: { superficie: number }) => row.superficie.toString(),
      sortable: true,
      format: (row: { superficie: number }) => `${row.superficie.toLocaleString()} m²`,
    },
    {
      name: "Valor Comercial",
      selector: (row: { valor_comercial: number }) => row.valor_comercial.toString(),
      sortable: true,
      format: (row: { valor_comercial: number }) => formatCurrency(row.valor_comercial, "MXN"),
    },
    {
      name: "Clave Catastral",
      selector: (row: { clave_catastral: string }) => row.clave_catastral,
      sortable: true,
    },
    {
      name: "Base Predial",
      selector: (row: { base_predial: number }) => row.base_predial.toString(),
      sortable: true,
      format: (row: { base_predial: number }) => formatCurrency(row.base_predial, "MXN"),
    },
    {
      name: "Proyecto",
      selector: (row: { proyecto: { nombre: string } }) => row.proyecto.nombre,
      sortable: true,
    },
    {
      name: "Clasificación",
      selector: (row: { clasificacion?: string }) => row.clasificacion || "N/A",
      sortable: true,
    },
    {
      name: "Latitud",
      selector: (row: { latitud?: number }) => row.latitud?.toString() || "N/A",
      sortable: true,
      format: (row: { latitud?: number }) => row.latitud ? row.latitud.toFixed(6) : "N/A",
    },
    {
      name: "Longitud",
      selector: (row: { longitud?: number }) => row.longitud?.toString() || "N/A",
      sortable: true,
      format: (row: { longitud?: number }) => row.longitud ? row.longitud.toFixed(6) : "N/A",
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
      {propiedades.length > 0 ? (
        <>
          {isClient ? (
            <Datatable 
              columns={columns} 
              data={propiedades}
            />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron propiedades."
          description="No se encontraron propiedades en la base de datos."
        />
      )}
    </div>
  );
};

export default PropertiesDataTable;
