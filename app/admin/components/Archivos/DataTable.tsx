"use client";

import ArchivoForm from "./Form";
import { useEffect, useState } from "react";
import { useModal } from "@/app/shared/hooks";
import { TrashIcon } from "@/app/shared/icons";
import { extractBlobName } from "@/app/shared/utils/extractBlobName";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IArchivo } from "@/app/shared/interfaces";

interface IArchivosDataTable {
  refresh: () => void;
  archivos: IArchivo[];
}

const ArchivosDataTable = ({ refresh, archivos }: IArchivosDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const [archivoSelected, setArchivoSelected] = useState<IArchivo | null>(null);

  const handleAction = (row: IArchivo) => {
    setArchivoSelected(row);
    onOpen();
  };

  const columns = [
    {
      name: "Acciones",
      width: "100px",
      cell: (row: IArchivo) => (
        <button
          onClick={() => handleAction(row)}
          className="px-4 py-2 text-white bg-red-400 rounded-md"
        >
          <TrashIcon />
        </button>
      ),
    },
    {
      name: "Archivo",
      selector: (row: { url: string }) => row.url,
      format: (row: { url: string }) => {
        const name = extractBlobName(row.url, "my-files").toUpperCase();
        return (
          <a href={row.url} target="_blank" className="text-blue-600 underline">
            {name.includes("AC")
              ? "Acta Constitutiva"
              : name.includes("ASE")
              ? "Asamblea"
              : name.includes("PODER")
              ? "Apoderado Legal"
              : name.includes("PROPIEDAD")
              ? "Escritura de Propiedad"
              : name.includes("INE")
              ? "Identificación de Apoderado o Propietario"
              : name.includes("CSF")
              ? "Constancia de Situación Fiscal"
              : name.includes("KML")
              ? "Google Earth"
              : name.includes("DWG")
              ? "Archivo DWG"
              : name.includes("PLANO")
              ? "Plano"
              : `Sin nombre clave (${name})`}
          </a>
        );
      },
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ArchivoForm refresh={refresh} archivo={archivoSelected!} />
        </Modal>
      )}
      {archivos.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={archivos} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No hay archivos"
          description="No se han encontrado archivos."
        />
      )}
    </>
  );
};

export default ArchivosDataTable;
