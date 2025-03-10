"use client";

import { useEffect, useState } from "react";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { Card404, Datatable, DatatableSkeleton } from "@/app/shared/components";
import type { ISociedadProyecto } from "@/app/shared/interfaces";

const columns = [
  {
    name: "Valor",
    selector: (row: { valor: number }) => row.valor,
    sortable: true,
    format: (row: { valor: number }) => formatCurrency(row.valor, "MXN"),
  },
  {
    name: "Porcentaje de Participación",
    selector: (row: { sociedad: { porcentaje_participacion: number } }) =>
      row.sociedad.porcentaje_participacion,
    sortable: true,
  },
  {
    name: "Creado en",
    selector: (row: { created_at: Date }) => row.created_at.toString(),
    sortable: true,
    format: (row: { created_at: Date }) =>
      formatDateLatinAmerican(row.created_at),
  },
];

interface ISociedadesDataTable {
  sociedades: ISociedadProyecto[];
}

const SociedadesDataTable = ({ sociedades }: ISociedadesDataTable) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {sociedades.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={sociedades} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron sociedades"
          description="No hay sociedades asociadas a este proyecto"
        />
      )}
    </>
  );
};

export default SociedadesDataTable;
