"use client";

import formatCurrency from "@/app/shared/utils/format-currency";
import { useEffect, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { Card404, Datatable, DatatableSkeleton } from "@/app/shared/components";
import type { IRenta } from "@/app/shared/interfaces";

interface IRentsDataTable {
  rents: IRenta[];
}

const RentsDataTable = ({ rents }: IRentsDataTable) => {
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Nombre Comercial",
      maxwidth: "200px",
      selector: (row: { nombre_comercial: string }) => row.nombre_comercial,
      sortable: true,
    },
    {
      name: "Razón Social",
      selector: (row: { razon_social: string }) => row.razon_social,
      sortable: true,
    },
    {
      name: "Renta sin IVA",
      selector: (row: { renta_sin_iva: number }) => row.renta_sin_iva,
      sortable: true,
      format: (row: { renta_sin_iva: number }) =>
        formatCurrency(row.renta_sin_iva, "MXN"),
    },
    {
      name: "Meses de Depósito Garantía",
      selector: (row: { meses_deposito_garantia?: number }) =>
        row.meses_deposito_garantia || "Sin meses",
      sortable: true,
    },
    {
      name: "Monto de Depósito Garantía",
      selector: (row: {
        renta_sin_iva: number;
        meses_deposito_garantia?: number;
      }) =>
        row.meses_deposito_garantia
          ? row.renta_sin_iva * row.meses_deposito_garantia
          : 0,
      sortable: true,
      format: (row: {
        renta_sin_iva: number;
        meses_deposito_garantia?: number;
      }) =>
        row.meses_deposito_garantia
          ? formatCurrency(
              row.renta_sin_iva * row.meses_deposito_garantia,
              "MXN"
            )
          : "Sin meses de depósito de garantía",
    },
    {
      name: "Meses Gracia",
      selector: (row: { meses_gracia?: number }) =>
        row.meses_gracia || "Sin meses",
      sortable: true,
    },
    {
      name: "Meses Gracia Inicio",
      selector: (row: { meses_gracia_fecha_inicio?: Date }) =>
        row.meses_gracia_fecha_inicio?.toString() || "",
      sortable: true,
      format: (row: { meses_gracia_fecha_inicio?: Date }) =>
        row.meses_gracia_fecha_inicio
          ? formatDateLatinAmerican(row.meses_gracia_fecha_inicio)
          : "Sin meses de gracia",
    },
    {
      name: "Meses Gracia Fin",
      selector: (row: { meses_gracia_fecha_fin?: Date }) =>
        row.meses_gracia_fecha_fin?.toString() || "",
      sortable: true,
      format: (row: { meses_gracia_fecha_fin?: Date }) =>
        row.meses_gracia_fecha_fin
          ? formatDateLatinAmerican(row.meses_gracia_fecha_fin)
          : "Sin meses de gracia",
    },
    {
      name: "Meses Renta Anticipada",
      selector: (row: { meses_renta_anticipada?: number }) =>
        row.meses_renta_anticipada || "Sin meses",
      sortable: true,
    },
    {
      name: "Renta Anticipada Inicio",
      selector: (row: { renta_anticipada_fecha_inicio?: Date }) =>
        row.renta_anticipada_fecha_inicio?.toString() || "",
      sortable: true,
      format: (row: { renta_anticipada_fecha_inicio?: Date }) =>
        row.renta_anticipada_fecha_inicio
          ? formatDateLatinAmerican(row.renta_anticipada_fecha_inicio)
          : "Sin renta anticipada",
    },
    {
      name: "Renta Anticipada Fin",
      selector: (row: { renta_anticipada_fecha_fin?: Date }) =>
        row.renta_anticipada_fecha_fin?.toString() || "",
      sortable: true,
      format: (row: { renta_anticipada_fecha_fin?: Date }) =>
        row.renta_anticipada_fecha_fin
          ? formatDateLatinAmerican(row.renta_anticipada_fecha_fin)
          : "Sin renta anticipada",
    },
    {
      name: "Monto Renta Anticipada",
      selector: (row: {
        renta_sin_iva: number;
        meses_renta_anticipada?: number;
      }) =>
        row.meses_renta_anticipada
          ? row.renta_sin_iva * row.meses_renta_anticipada
          : 0,
      sortable: true,
      format: (row: {
        renta_sin_iva: number;
        meses_renta_anticipada?: number;
      }) =>
        row.meses_renta_anticipada
          ? formatCurrency(
              row.renta_sin_iva * row.meses_renta_anticipada,
              "MXN"
            )
          : "Sin renta anticipada",
    },
    {
      name: "Incremento Mes",
      selector: (row: { incremento_mes: string }) => row.incremento_mes,
      sortable: true,
    },
    {
      name: "Incremento Nota",
      selector: (row: { incremento_nota?: string }) =>
        row.incremento_nota || "Sin incremento",
      sortable: true,
    },
    {
      name: "Inicio Vigencia",
      selector: (row: { inicio_vigencia: Date }) =>
        row.inicio_vigencia.toString(),
      sortable: true,
      format: (row: { inicio_vigencia: Date }) =>
        formatDateLatinAmerican(row.inicio_vigencia),
    },
    {
      name: "Fin Vigencia Forzosa",
      selector: (row: { fin_vigencia_forzosa: Date }) =>
        row.fin_vigencia_forzosa.toString(),
      sortable: true,
      format: (row: { fin_vigencia_forzosa: Date }) =>
        formatDateLatinAmerican(row.fin_vigencia_forzosa),
    },
    {
      name: "Fin Vigencia No Forzosa",
      selector: (row: { fin_vigencia_no_forzosa?: Date }) =>
        row.fin_vigencia_no_forzosa?.toString() || "",
      sortable: true,
      format: (row: { fin_vigencia_no_forzosa?: Date }) =>
        row.fin_vigencia_no_forzosa
          ? formatDateLatinAmerican(row.fin_vigencia_no_forzosa)
          : "Sin fin de vigencia no forzosa",
    },
    {
      name: "Vigencia Nota",
      selector: (row: { vigencia_nota?: string }) =>
        row.vigencia_nota || "Sin vigencia",
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
      {rents.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={rents} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron rentas"
          description="No se encontraron rentas asociadas a esta propiedad en la base de datos."
        />
      )}
    </>
  );
};

export default RentsDataTable;
