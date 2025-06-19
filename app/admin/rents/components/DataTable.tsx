"use client";

import Form from "./Form";
import formatCurrency from "@/app/shared/utils/format-currency";
import { ExpanderComponentProps } from "react-data-table-component";
import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useCallback, useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateSimple from "@/app/shared/utils/formatdate-simple";
import { PropiedadesDataTable, RentsPropertiesForm } from "./Propiedades";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IPropiedad, IRenta } from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "add" | "edit" | "delete";
  selectedRenta: IRenta | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: { action: "add" | "edit" | "delete"; renta: IRenta | null };
    }
  | { type: "CLOSE_MODAL" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        open: true,
        action: action.payload.action,
        selectedRenta: action.payload.renta,
      };
    case "CLOSE_MODAL":
      return { ...state, open: false };
    default:
      return state;
  }
};

interface IRentsDataTable {
  rents: IRenta[];
  propiedades: IPropiedad[];
  refresh: () => void;
  onAction?: (renta: IRenta | null, action: "add" | "edit" | "delete") => void;
}

const RentsDataTable = ({ rents, propiedades, refresh, onAction }: IRentsDataTable) => {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedRenta: null,
  });

  const handleAction = useCallback((
    renta: IRenta | null,
    action: "add" | "edit" | "delete"
  ) => {
    if (onAction) {
      onAction(renta, action);
    } else {
      dispatch({ type: "OPEN_MODAL", payload: { action, renta } });
    }
  }, [onAction]);

  const [optimisticData, setOptimisticData] = useOptimistic(
    rents,
    (currentData, renta: IRenta | null) => {
      if (state.action === "add") return [...currentData, renta] as IRenta[];
      if (state.action === "edit")
        return currentData.map((i) =>
          i.id === renta?.id ? renta : i
        ) as IRenta[];
      if (state.action === "delete")
        return currentData.filter((i) => i.id !== renta?.id) as IRenta[];
      return currentData;
    }
  );

  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: IRenta) => (
        <div className="flex justify-center gap-2">
          <RentsPropertiesForm
            action="add"
            rentaId={row.id}
            propiedad={propiedades.filter(
              (propiedad) =>
                !row.propiedades.map((p) => p.id).includes(propiedad.id)
            )}
            refresh={refresh}
          />
          <button
            onClick={() => handleAction(row, "edit")}
            className="p-2 text-white bg-blue-400 rounded-md"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => handleAction(row, "delete")}
            className="p-2 text-white bg-red-400 rounded-md"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
    {
      name: "¿Está disponible?",
      selector: (row: { esta_disponible: boolean }) =>
        row.esta_disponible ? "Sí" : "No",
      sortable: true,
    },
    {
      name: "Nombre Comercial",
      maxwidth: "200px",
      selector: (row: { nombre_comercial?: string }) =>
        row.nombre_comercial || "Aún sin asignar",
      sortable: true,
    },
    {
      name: "Razón Social",
      selector: (row: { razon_social?: string }) =>
        row.razon_social || "Aún sin asignar",
      sortable: true,
    },
    {
      name: "Renta sin IVA",
      selector: (row: { renta_sin_iva?: number }) => row.renta_sin_iva || 0,
      sortable: true,
      format: (row: { renta_sin_iva?: number }) =>
        row.renta_sin_iva ? formatCurrency(row.renta_sin_iva, "MXN") : 0,
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
        renta_sin_iva?: number;
        meses_deposito_garantia?: number;
      }) =>
        row.renta_sin_iva && row.meses_deposito_garantia
          ? row.renta_sin_iva * row.meses_deposito_garantia
          : 0,
      sortable: true,
      format: (row: {
        renta_sin_iva?: number;
        meses_deposito_garantia?: number;
      }) =>
        row.renta_sin_iva && row.meses_deposito_garantia
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
          ? formatDateSimple(row.meses_gracia_fecha_inicio)
          : "Sin meses de gracia",
    },
    {
      name: "Meses Gracia Fin",
      selector: (row: { meses_gracia_fecha_fin?: Date }) =>
        row.meses_gracia_fecha_fin?.toString() || "",
      sortable: true,
      format: (row: { meses_gracia_fecha_fin?: Date }) =>
        row.meses_gracia_fecha_fin
          ? formatDateSimple(row.meses_gracia_fecha_fin)
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
          ? formatDateSimple(row.renta_anticipada_fecha_inicio)
          : "Sin renta anticipada",
    },
    {
      name: "Renta Anticipada Fin",
      selector: (row: { renta_anticipada_fecha_fin?: Date }) =>
        row.renta_anticipada_fecha_fin?.toString() || "",
      sortable: true,
      format: (row: { renta_anticipada_fecha_fin?: Date }) =>
        row.renta_anticipada_fecha_fin
          ? formatDateSimple(row.renta_anticipada_fecha_fin)
          : "Sin renta anticipada",
    },
    {
      name: "Monto Renta Anticipada",
      selector: (row: {
        renta_sin_iva?: number;
        meses_renta_anticipada?: number;
      }) =>
        row.renta_sin_iva && row.meses_renta_anticipada
          ? row.renta_sin_iva * row.meses_renta_anticipada
          : 0,
      sortable: true,
      format: (row: {
        renta_sin_iva?: number;
        meses_renta_anticipada?: number;
      }) =>
        row.renta_sin_iva && row.meses_renta_anticipada
          ? formatCurrency(
              row.renta_sin_iva * row.meses_renta_anticipada,
              "MXN"
            )
          : "Sin renta anticipada",
    },
    {
      name: "Incremento Mes",
      selector: (row: { incremento_mes?: string }) =>
        row.incremento_mes || "Aún sin asignar",
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
      selector: (row: { inicio_vigencia?: Date }) =>
        row.inicio_vigencia
          ? row.inicio_vigencia.toString()
          : "Aún sin asignar",
      sortable: true,
      format: (row: { inicio_vigencia?: Date }) =>
        row.inicio_vigencia
          ? formatDateSimple(row.inicio_vigencia)
          : "Aún sin asignar",
    },
    {
      name: "Fin Vigencia Forzosa",
      selector: (row: { fin_vigencia_forzosa?: Date }) =>
        row.fin_vigencia_forzosa
          ? row.fin_vigencia_forzosa.toString()
          : "Aún sin asignar",
      sortable: true,
      format: (row: { fin_vigencia_forzosa?: Date }) =>
        row.fin_vigencia_forzosa
          ? formatDateSimple(row.fin_vigencia_forzosa)
          : "Aún sin asignar",
    },
    {
      name: "Fin Vigencia No Forzosa",
      selector: (row: { fin_vigencia_no_forzosa?: Date }) =>
        row.fin_vigencia_no_forzosa?.toString() || "",
      sortable: true,
      format: (row: { fin_vigencia_no_forzosa?: Date }) =>
        row.fin_vigencia_no_forzosa
          ? formatDateSimple(row.fin_vigencia_no_forzosa)
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

  const ExpandedComponent: React.FC<ExpanderComponentProps<IRenta>> = ({
    data,
  }) => {
    return (
      <div className="pl-12 py-4">
        <h1 className="text-2xl">
          Propiedades de la Renta: {`"${data.nombre_comercial}"`}
        </h1>
        <PropiedadesDataTable
          rentaId={data.id}
          propiedades={data.propiedades}
          refresh={refresh}
        />
      </div>
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {!onAction && state.open && (
        <Modal
          isOpen={state.open}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <Form
            action={state.action}
            propiedades={propiedades}
            renta={state.selectedRenta}
            refresh={refresh}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
          />
        </Modal>
      )}
      {!onAction && (
        <div className="w-full text-right mb-4">
          <button
            onClick={() => handleAction(null, "add")}
            className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
          >
            +
          </button>
        </div>
      )}
      {rents.length > 0 ? (
        <>
          {isClient ? (
            <Datatable
              columns={columns}
              data={onAction ? rents : optimisticData}
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
          title="No se encontraron rentas"
          description="No se encontraron rentas en la base de datos."
        />
      )}
    </>
  );
};

export default RentsDataTable;
