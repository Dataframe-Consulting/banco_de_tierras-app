"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/app/shared/hooks";
import { TrashIcon } from "@/app/shared/icons";
import PropiedadPropietarioSociedadForm from "./Form";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type {
  IPropietario,
  IPropietarioSociedad,
} from "@/app/shared/interfaces";

interface IPropietariosSociedadesDataTable {
  propietario_sociedad: IPropietarioSociedad[];
  propiedadValorComercial: number;
  refresh: () => void;
}

const PropietariosSociedadesDataTable = ({
  propietario_sociedad,
  propiedadValorComercial,
  refresh,
}: IPropietariosSociedadesDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const [propietarioSociedad, setPropietarioSociedad] =
    useState<IPropietarioSociedad | null>(null);

  const columns = [
    {
      name: "Acciones",
      width: "90px",
      cell: (row: IPropietarioSociedad) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setPropietarioSociedad(row);
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
      name: "Titulo",
      selector: (row: { es_socio: boolean }) =>
        row.es_socio ? "Socio" : "Propietario",
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row: { propietario: IPropietario }) => row.propietario.nombre,
      sortable: true,
    },
    {
      name: "RFC",
      selector: (row: { propietario: IPropietario }) => row.propietario.rfc,
      sortable: true,
    },
    {
      name: "Porcentaje de Participación",
      selector: (row: { sociedad_porcentaje_participacion: number }) =>
        row.sociedad_porcentaje_participacion,
      sortable: true,
    },
    {
      name: "Valor de Participación",
      selector: (row: { sociedad_porcentaje_participacion: number }) =>
        formatCurrency(
          (row.sociedad_porcentaje_participacion * propiedadValorComercial) /
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
      {isOpen && propietarioSociedad && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <PropiedadPropietarioSociedadForm
            action="delete"
            propietario_sociedad={propietarioSociedad}
            onCloseForm={onClose}
            refresh={refresh}
          />
        </Modal>
      )}
      {propietario_sociedad.length > 0 ? (
        <>
          {isClient ? (
            <Datatable columns={columns} data={propietario_sociedad} />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron propietarios/socios"
          description="No hay propietarios/socios registrados para esta propiedad."
        />
      )}
    </>
  );
};

export default PropietariosSociedadesDataTable;
