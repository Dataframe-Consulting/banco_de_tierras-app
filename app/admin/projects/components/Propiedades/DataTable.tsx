"use client";

import { useEffect, useState } from "react";
import formatCurrency from "@/app/shared/utils/format-currency";
import { Card404, Datatable, DatatableSkeleton } from "@/app/shared/components";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import type { IPropiedad } from "@/app/shared/interfaces";

interface IPropertiesDataTable {
  propiedades: IPropiedad[];
}

const PropertiesDataTable = ({ propiedades }: IPropertiesDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Nombre",
      maxwidth: "200px",
      selector: (row: { nombre: string }) => row.nombre,
      sortable: true,
    },
    {
      name: "Superficie (m²)",
      selector: (row: { superficie: number }) => row.superficie,
      sortable: true,
    },
    {
      name: "Valor Comercial",
      selector: (row: { valor_comercial: number }) => row.valor_comercial,
      sortable: true,
      format: (row: { valor_comercial: number }) =>
        formatCurrency(row.valor_comercial, "MXN"),
    },
    {
      name: "Año Valor Comercial",
      selector: (row: { anio_valor_comercial?: number }) =>
        row.anio_valor_comercial ?? "N/A",
      sortable: true,
    },
    {
      name: "Clave Catastral",
      selector: (row: { clave_catastral: string }) => row.clave_catastral,
      sortable: true,
    },
    {
      name: "Base Predial",
      selector: (row: { base_predial: number }) => row.base_predial,
      sortable: true,
      format: (row: { base_predial: number }) =>
        formatCurrency(row.base_predial, "MXN"),
    },
    {
      name: "Adeudo Predial",
      selector: (row: { adeudo_predial?: number }) =>
        row.adeudo_predial ?? "N/A",
      sortable: true,
      format: (row: { adeudo_predial?: number }) =>
        row.adeudo_predial ? formatCurrency(row.adeudo_predial, "MXN") : "N/A",
    },
    {
      name: "Años Pend. Predial",
      selector: (row: { anios_pend_predial?: number }) =>
        row.anios_pend_predial ?? "N/A",
      sortable: true,
    },
    {
      name: "Comentarios",
      selector: (row: { comentarios?: string }) =>
        row.comentarios ?? "Sin comentarios",
      wrap: true,
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
    <>
      {propiedades.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={propiedades} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron propiedades"
          description="No se encontraron propiedades asociadas al proyecto en la base de datos."
        />
      )}
    </>
  );
};

export default PropertiesDataTable;
