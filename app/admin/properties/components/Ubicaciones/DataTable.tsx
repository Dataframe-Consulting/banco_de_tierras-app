"use client";

import { useEffect, useState } from "react";
import { IUbicacion } from "@/app/shared/interfaces";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Card404,
  Datatable,
  DatatableSkeleton,
  Modal,
} from "@/app/shared/components";
import PropertiesLocationsForm from "./Form";
import { useModal } from "@/app/shared/hooks";
import { TrashIcon } from "@/app/shared/icons";

interface IUbicacionesDataTable {
  propiedadId: number;
  ubicaciones: IUbicacion[];
  refresh: () => void;
}

const UbicacionesDataTable = ({
  propiedadId,
  ubicaciones,
  refresh,
}: IUbicacionesDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const [ubicacionSelected, setUbicacionSelected] = useState<IUbicacion | null>(
    null
  );

  const columns = [
    {
      name: "Acciones",
      width: "90px",
      cell: (row: IUbicacion) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setUbicacionSelected(row);
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
      name: "Nombre",
      selector: (row: { nombre: string }) => row.nombre,
      sortable: true,
      cell: (row: { nombre: string }) => row.nombre,
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
      {isOpen && ubicacionSelected && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <PropertiesLocationsForm
            action="delete"
            ubicacion={ubicacionSelected}
            propiedadId={propiedadId}
            onCloseForm={onClose}
            refresh={refresh}
          />
        </Modal>
      )}
      {ubicaciones.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={ubicaciones} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron ubicaciones"
          description="No hay ubicaciones asociadas a esta propiedad"
        />
      )}
    </>
  );
};

export default UbicacionesDataTable;
