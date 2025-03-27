"use client";

import { useEffect, useState } from "react";
import PropertiesGuaranteesForm from "./Form";
import { useModal } from "@/app/shared/hooks";
import { TrashIcon } from "@/app/shared/icons";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IGarantia } from "@/app/shared/interfaces";

interface IGarantiasDataTable {
  propiedadId: number;
  garantias: IGarantia[];
  refresh: () => void;
}

const GarantiasDatatable = ({
  propiedadId,
  garantias,
  refresh,
}: IGarantiasDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const [garantiaSelected, setGarantiaSelected] = useState<IGarantia | null>(
    null
  );

  const columns = [
    {
      name: "Acciones",
      width: "90px",
      cell: (row: IGarantia) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setGarantiaSelected(row);
              onOpen();
            }}
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
      selector: (row: { monto: number }) => row.monto,
      sortable: true,
      format: (row: { monto: number }) => formatCurrency(row.monto, "MXN"),
    },
    {
      name: "Fecha de Inicio",
      selector: (row: { fecha_inicio: Date }) => row.fecha_inicio.toString(),
      sortable: true,
      format: (row: { fecha_inicio: Date }) =>
        formatDateLatinAmerican(row.fecha_inicio),
    },
    {
      name: "Fecha de Fin",
      selector: (row: { fecha_fin: Date }) => row.fecha_fin.toString(),
      sortable: true,
      format: (row: { fecha_fin: Date }) =>
        formatDateLatinAmerican(row.fecha_fin),
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
      {isOpen && garantiaSelected && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <PropertiesGuaranteesForm
            action="delete"
            garantia={garantiaSelected}
            propiedadId={propiedadId}
            onCloseForm={onClose}
            refresh={refresh}
          />
        </Modal>
      )}
      {garantias.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={garantias} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron garantias"
          description="No hay garantias asociadas a esta propiedad"
        />
      )}
    </>
  );
};

export default GarantiasDatatable;
