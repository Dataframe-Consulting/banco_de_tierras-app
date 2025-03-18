"use client";

import { useEffect, useState } from "react";
import PropertiesSocietiesForm from "./Form";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
  Modal,
} from "@/app/shared/components";
import type { ISociedad } from "@/app/shared/interfaces";
import { TrashIcon } from "@/app/shared/icons";
import { useModal } from "@/app/shared/hooks";

interface ISociedadesDataTable {
  propiedadId: number;
  sociedades: ISociedad[];
  propiedadValorComercial: number;
}

const SociedadesDataTable = ({
  sociedades,
  propiedadId,
  propiedadValorComercial,
}: ISociedadesDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {
      name: "Acciones",
      width: "90px",
      cell: (row: ISociedad) => (
        <div className="flex justify-center gap-2">
          <Modal isOpen={isOpen} onClose={onClose}>
            <PropertiesSocietiesForm
              action="delete"
              sociedad={row}
              propiedadId={propiedadId}
            />
          </Modal>
          <button
            onClick={onOpen}
            className="px-4 py-2 text-white bg-red-400 rounded-md"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
    {
      name: "Porcentaje de Participación",
      selector: (row: { porcentaje_participacion: number }) =>
        row.porcentaje_participacion,
      sortable: true,
    },
    {
      name: "Valor de Participación",
      selector: (row: { porcentaje_participacion: number }) =>
        formatCurrency(
          (row.porcentaje_participacion * propiedadValorComercial) / 100,
          "MXN"
        ),
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
          description="No hay sociedades asociadas a esta propiedad."
        />
      )}
    </>
  );
};

export default SociedadesDataTable;
