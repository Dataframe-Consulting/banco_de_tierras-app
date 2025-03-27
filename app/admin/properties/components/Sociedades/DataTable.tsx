"use client";

import { useEffect, useState } from "react";
import PropertiesSocietiesForm from "./Form";
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
import type { ISociedad, ISociedadPropiedad } from "@/app/shared/interfaces";

interface ISociedadesDataTable {
  propiedadId: number;
  sociedades: ISociedadPropiedad[];
  propiedadValorComercial: number;
  refresh: () => void;
}

const SociedadesDataTable = ({
  sociedades,
  propiedadId,
  propiedadValorComercial,
  refresh,
}: ISociedadesDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const [sociedadSelected, setSociedadSelected] =
    useState<ISociedadPropiedad | null>(null);

  const columns = [
    {
      name: "Acciones",
      width: "90px",
      cell: (row: ISociedadPropiedad) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setSociedadSelected(row);
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
      name: "Porcentaje de Participación",
      selector: (row: { sociedad: ISociedad }) =>
        row.sociedad.porcentaje_participacion,
      sortable: true,
    },
    {
      name: "Valor de Participación",
      selector: (row: { sociedad: ISociedad }) =>
        formatCurrency(
          (row.sociedad.porcentaje_participacion * propiedadValorComercial) /
            100,
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
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isOpen && sociedadSelected && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <PropertiesSocietiesForm
            action="delete"
            sociedad={sociedadSelected}
            propiedadId={propiedadId}
            onCloseForm={onClose}
            refresh={refresh}
          />
        </Modal>
      )}
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
