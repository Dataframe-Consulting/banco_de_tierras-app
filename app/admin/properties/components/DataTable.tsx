"use client";

import Form from "./Form";
import cn from "@/app/shared/utils/cn";
import { RentsDataTable } from "./Rentas";
import formatCurrency from "@/app/shared/utils/format-currency";
import { ExpanderComponentProps } from "react-data-table-component";
import { PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
import { useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { PropertiesSocietiesForm, SociedadesDataTable } from "./Sociedades";
import { PropertiesLocationsForm, UbicacionesDataTable } from "./Ubicaciones";
import { PropertiesGuaranteesForm, GarantiasDataTable } from "./Garantias";
import {
  PropertiesLegalProcessesForm,
  ProcesosLegalesDataTable,
} from "./ProcesosLegales";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type {
  IProyecto,
  IGarantia,
  ISociedad,
  IUbicacion,
  IPropiedad,
  IProcesoLegal,
} from "@/app/shared/interfaces";
import { useModal } from "@/app/shared/hooks";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedData: IPropiedad | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; data: IPropiedad | null };
    }
  | { type: "CLOSE_MODAL" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        open: true,
        action: action.payload.action,
        selectedData: action.payload.data,
      };
    case "CLOSE_MODAL":
      return { ...state, open: false };
    default:
      return state;
  }
};

interface IPropertiesDataTable {
  garantias: IGarantia[];
  proyectos: IProyecto[];
  sociedades: ISociedad[];
  ubicaciones: IUbicacion[];
  propiedades: IPropiedad[];
  procesosLegales: IProcesoLegal[];
  refresh: () => void;
}

const PropertiesDataTable = ({
  proyectos,
  garantias,
  sociedades,
  ubicaciones,
  propiedades,
  procesosLegales,
  refresh,
}: IPropertiesDataTable) => {
  const { isOpen, onClose, onOpen } = useModal();
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedData: null,
  });
  const [propiedadSelected, setPropiedadSelected] = useState<IPropiedad | null>(
    null
  );

  const handleAction = (
    data: IPropiedad | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, data } });
  };

  const [optimisticData, setOptimisticData] = useOptimistic(
    propiedades,
    (currentData, data: IPropiedad | null) => {
      if (state.action === "add") return [...currentData, data] as IPropiedad[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === data?.id ? data : i
        ) as IPropiedad[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== data?.id) as IPropiedad[];
      return currentData;
    }
  );

  const columns = [
    {
      name: "Acciones",
      width: "220px",
      cell: (row: IPropiedad) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setPropiedadSelected(row);
              onOpen();
            }}
            className="px-4 py-2 bg-green-400 text-white rounded-md"
          >
            <PlusCircle />
          </button>
          <button
            onClick={() => handleAction(row, "edit")}
            className="px-4 py-2 text-white bg-blue-400 rounded-md"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => handleAction(row, "delete")}
            className="px-4 py- text-white bg-red-400 rounded-md"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
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
      name: "Proyecto",
      selector: (row: { proyecto: { nombre: string } }) => row.proyecto.nombre,
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

  const ExpandedComponent: React.FC<ExpanderComponentProps<IPropiedad>> = ({
    data,
  }) => {
    const [tab, setTab] = useState<
      "rentas" | "sociedades" | "ubicaciones" | "garantias" | "procesos_legales"
    >("rentas");

    return (
      <div className="pl-12 py-4">
        <ul className="flex flex-row gap-4">
          <li>
            <button
              onClick={() => setTab("rentas")}
              className={cn(
                "px-4 py-2 rounded-md",
                tab === "rentas"
                  ? "bg-[#C23B2E] text-white"
                  : "bg-gray-200 text-gray-700"
              )}
            >
              Rentas
            </button>
          </li>
          <li>
            <button
              onClick={() => setTab("sociedades")}
              className={cn(
                "px-4 py-2 rounded-md",
                tab === "sociedades"
                  ? "bg-[#C23B2E] text-white"
                  : "bg-gray-200 text-gray-700"
              )}
            >
              Sociedades
            </button>
          </li>
          <li>
            <button
              onClick={() => setTab("ubicaciones")}
              className={cn(
                "px-4 py-2 rounded-md",
                tab === "ubicaciones"
                  ? "bg-[#C23B2E] text-white"
                  : "bg-gray-200 text-gray-700"
              )}
            >
              Ubicaciones
            </button>
          </li>
          <li>
            <button
              onClick={() => setTab("garantias")}
              className={cn(
                "px-4 py-2 rounded-md",
                tab === "garantias"
                  ? "bg-[#C23B2E] text-white"
                  : "bg-gray-200 text-gray-700"
              )}
            >
              Garantías
            </button>
          </li>
          <div>
            <button
              onClick={() => setTab("procesos_legales")}
              className={cn(
                "px-4 py-2 rounded-md",
                tab === "procesos_legales"
                  ? "bg-[#C23B2E] text-white"
                  : "bg-gray-200 text-gray-700"
              )}
            >
              Procesos Legales
            </button>
          </div>
        </ul>
        {tab === "rentas" && <RentsDataTable rents={data.rentas} />}
        {tab === "sociedades" && (
          <SociedadesDataTable
            propiedadId={data.id}
            sociedades={data.sociedades}
            propiedadValorComercial={data.valor_comercial}
            refresh={refresh}
          />
        )}
        {tab === "ubicaciones" && (
          <UbicacionesDataTable
            propiedadId={data.id}
            ubicaciones={data.ubicaciones}
            refresh={refresh}
          />
        )}
        {tab === "garantias" && (
          <GarantiasDataTable
            propiedadId={data.id}
            garantias={data.garantias}
            refresh={refresh}
          />
        )}
        {tab === "procesos_legales" && (
          <ProcesosLegalesDataTable
            propiedadId={data.id}
            procesosLegales={data.procesos_legales}
            refresh={refresh}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isOpen && propiedadSelected && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <AddMenu
            propiedad={propiedadSelected}
            garantias={garantias}
            sociedades={sociedades}
            ubicaciones={ubicaciones}
            procesosLegales={procesosLegales}
            onClose={onClose}
            refresh={refresh}
          />
        </Modal>
      )}
      {state.open && (
        <Modal
          isOpen={state.open}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <Form
            action={state.action}
            propiedad={state.selectedData}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
            proyectos={proyectos}
            sociedades={sociedades}
            ubicaciones={ubicaciones}
            garantias={garantias}
            procesosLegales={procesosLegales}
            refresh={refresh}
          />
        </Modal>
      )}
      <div className="w-full text-right">
        <button
          onClick={() => handleAction(null, "add")}
          className="px-4 py-2 text-white bg-green-400 rounded-md"
        >
          <PlusCircle />
        </button>
      </div>
      {propiedades.length > 0 ? (
        <>
          {isClient ? (
            <Datatable
              columns={columns}
              data={optimisticData}
              isExpandable
              expandableRowsComponent={(props) => (
                <ExpandedComponent {...props} />
              )}
            />
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron propiedades"
          description="No se encontraron propiedades en la base de datos."
        />
      )}
    </>
  );
};

export default PropertiesDataTable;

interface IAddMenu {
  propiedad: IPropiedad;
  garantias: IGarantia[];
  sociedades: ISociedad[];
  ubicaciones: IUbicacion[];
  procesosLegales: IProcesoLegal[];
  onClose: () => void;
  refresh: () => void;
}

const AddMenu = ({
  propiedad,
  garantias,
  sociedades,
  ubicaciones,
  procesosLegales,
  onClose,
  refresh,
}: IAddMenu) => {
  const [tab, setTab] = useState<
    "sociedades" | "ubicaciones" | "garantias" | "procesos_legales"
  >("sociedades");

  return (
    <div className="py-4 overflow-x-auto">
      <ul className="flex flex-row gap-4 mb-4">
        <li>
          <button
            onClick={() => setTab("sociedades")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "sociedades"
                ? "bg-[#C23B2E] text-white"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Sociedades
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("ubicaciones")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "ubicaciones"
                ? "bg-[#C23B2E] text-white"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Ubicaciones
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("garantias")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "garantias"
                ? "bg-[#C23B2E] text-white"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Garantías
          </button>
        </li>
        <div>
          <button
            onClick={() => setTab("procesos_legales")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "procesos_legales"
                ? "bg-[#C23B2E] text-white"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Procesos Legales
          </button>
        </div>
      </ul>
      {tab === "sociedades" && (
        <PropertiesSocietiesForm
          action="add"
          propiedadId={propiedad.id}
          sociedad={sociedades}
          onCloseForm={onClose}
          refresh={refresh}
        />
      )}
      {tab === "ubicaciones" && (
        <PropertiesLocationsForm
          action="add"
          propiedadId={propiedad.id}
          ubicacion={ubicaciones.filter(
            (ubicacion) =>
              !propiedad.ubicaciones.map((u) => u.id).includes(ubicacion.id)
          )}
          onCloseForm={onClose}
          refresh={refresh}
        />
      )}
      {tab === "garantias" && (
        <PropertiesGuaranteesForm
          action="add"
          propiedadId={propiedad.id}
          garantia={garantias.filter(
            (garantia) =>
              !propiedad.garantias.map((g) => g.id).includes(garantia.id)
          )}
          onCloseForm={onClose}
          refresh={refresh}
        />
      )}
      {tab === "procesos_legales" && (
        <PropertiesLegalProcessesForm
          action="add"
          propiedadId={propiedad.id}
          procesoLegal={procesosLegales.filter(
            (procesoLegal) =>
              !propiedad.procesos_legales
                .map((p) => p.id)
                .includes(procesoLegal.id)
          )}
          onCloseForm={onClose}
          refresh={refresh}
        />
      )}
    </div>
  );
};
