"use client";

import { useEffect, useState } from "react";
import { IProcesoLegal } from "@/app/shared/interfaces";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import PropertiesLegalProcessesForm from "./Form";
import { useModal } from "@/app/shared/hooks";
import { TrashIcon } from "@/app/shared/icons";

interface IProcesosLegalesDataTable {
  propiedadId: number;
  procesosLegales: IProcesoLegal[];
  refresh: () => void;
}

const ProcesosLegalesDataTable = ({
  propiedadId,
  procesosLegales,
  refresh,
}: IProcesosLegalesDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const [procesoLegalSelected, setProcesoLegalSelected] =
    useState<IProcesoLegal | null>(null);

  const columns = [
    {
      name: "Acciones",
      width: "60px",
      cell: (row: IProcesoLegal) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setProcesoLegalSelected(row);
              onOpen();
            }}
            className="p-2 text-white bg-red-400 rounded-md"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
    {
      name: "Abogado",
      selector: (row: { abogado: string }) => row.abogado,
      sortable: true,
      cell: (row: { abogado: string }) => row.abogado,
    },
    {
      name: "Tipo de proceso",
      selector: (row: { tipo_proceso: string }) => row.tipo_proceso,
      sortable: true,
    },
    {
      name: "Estatus",
      selector: (row: { estatus: string }) => row.estatus,
      sortable: true,
    },
    {
      name: "Comentarios",
      selector: (row: { comentarios?: string }) =>
        row.comentarios ?? "Sin comentarios",
      sortable: true,
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
      {isOpen && procesoLegalSelected && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <PropertiesLegalProcessesForm
            action="delete"
            procesoLegal={procesoLegalSelected}
            propiedadId={propiedadId}
            onCloseForm={onClose}
            refresh={refresh}
          />
        </Modal>
      )}
      {procesosLegales.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={procesosLegales} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron procesos legales"
          description="No hay procesos legales asociadas a esta propiedad"
        />
      )}
    </>
  );
};

export default ProcesosLegalesDataTable;
