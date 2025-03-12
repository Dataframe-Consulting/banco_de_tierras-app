"use client";

import Form from "./Form";
import formatCurrency from "@/app/shared/utils/format-currency";
import { ExpanderComponentProps } from "react-data-table-component";
import { PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
import { useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
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

const ExpandedComponent: React.FC<ExpanderComponentProps<IRenta>> = ({
  data,
}) => {
  return (
    <div className="pl-12 py-4">
      <h1 className="text-2xl">
        Propiedades de la Renta: {`"${data.nombre_comercial}"`}
      </h1>
      <PropiedadesDataTable rentaId={data.id} propiedades={data.propiedades} />
    </div>
  );
};

interface IRentsDataTable {
  rents: IRenta[];
  propiedades: IPropiedad[];
}

const RentsDataTable = ({ rents, propiedades }: IRentsDataTable) => {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    action: "add",
    selectedRenta: null,
  });

  const handleAction = (
    renta: IRenta | null,
    action: "add" | "edit" | "delete"
  ) => {
    dispatch({ type: "OPEN_MODAL", payload: { action, renta } });
  };

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
      width: "220px",
      cell: (row: IRenta) => (
        <div className="flex justify-center gap-2">
          <RentsPropertiesForm
            action="add"
            rentaId={row.id}
            propiedad={propiedades.filter(
              (propiedad) =>
                !row.propiedades.map((p) => p.id).includes(propiedad.id)
            )}
          />
          <button
            onClick={() => handleAction(row, "edit")}
            className="px-4 py-2 text-white bg-blue-400 rounded-md"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => handleAction(row, "delete")}
            className="px-4 py-2 text-white bg-red-400 rounded-md"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
    {
      name: "Nombre Comercial",
      maxwidth: "200px",
      selector: (row: { nombre_comercial: string }) => row.nombre_comercial,
      sortable: true,
    },
    {
      name: "Razón Social",
      selector: (row: { razon_social: string }) => row.razon_social,
      sortable: true,
    },
    {
      name: "Renta sin IVA",
      selector: (row: { renta_sin_iva: number }) => row.renta_sin_iva,
      sortable: true,
      format: (row: { renta_sin_iva: number }) =>
        formatCurrency(row.renta_sin_iva, "MXN"),
    },
    {
      name: "Depósito Garantía Concepto",
      selector: (row: { deposito_garantia_concepto?: string }) =>
        row.deposito_garantia_concepto || "Sin depósito",
      sortable: true,
    },
    {
      name: "Depósito Garantía Monto",
      selector: (row: { deposito_garantia_monto?: number }) =>
        row.deposito_garantia_monto || 0,
      sortable: true,
      format: (row: { deposito_garantia_monto?: number }) =>
        row.deposito_garantia_monto
          ? formatCurrency(row.deposito_garantia_monto, "MXN")
          : "Sin depósito",
    },
    {
      name: "Meses Gracia Concepto",
      selector: (row: { meses_gracia_concepto?: string }) =>
        row.meses_gracia_concepto || "Sin meses de gracia",
      sortable: true,
    },
    {
      name: "Meses Gracia Inicio",
      selector: (row: { meses_gracia_fecha_inicio?: Date }) =>
        row.meses_gracia_fecha_inicio?.toString() || "",
      sortable: true,
      format: (row: { meses_gracia_fecha_inicio?: Date }) =>
        row.meses_gracia_fecha_inicio
          ? formatDateLatinAmerican(row.meses_gracia_fecha_inicio)
          : "Sin meses de gracia",
    },
    {
      name: "Meses Gracia Fin",
      selector: (row: { meses_gracia_fecha_fin?: Date }) =>
        row.meses_gracia_fecha_fin?.toString() || "",
      sortable: true,
      format: (row: { meses_gracia_fecha_fin?: Date }) =>
        row.meses_gracia_fecha_fin
          ? formatDateLatinAmerican(row.meses_gracia_fecha_fin)
          : "Sin meses de gracia",
    },
    {
      name: "Renta Anticipada Concepto",
      selector: (row: { renta_anticipada_concepto?: string }) =>
        row.renta_anticipada_concepto || "Sin renta anticipada",
      sortable: true,
    },
    {
      name: "Renta Anticipada Inicio",
      selector: (row: { renta_anticipada_fecha_inicio?: Date }) =>
        row.renta_anticipada_fecha_inicio?.toString() || "",
      sortable: true,
      format: (row: { renta_anticipada_fecha_inicio?: Date }) =>
        row.renta_anticipada_fecha_inicio
          ? formatDateLatinAmerican(row.renta_anticipada_fecha_inicio)
          : "Sin renta anticipada",
    },
    {
      name: "Renta Anticipada Fin",
      selector: (row: { renta_anticipada_fecha_fin?: Date }) =>
        row.renta_anticipada_fecha_fin?.toString() || "",
      sortable: true,
      format: (row: { renta_anticipada_fecha_fin?: Date }) =>
        row.renta_anticipada_fecha_fin
          ? formatDateLatinAmerican(row.renta_anticipada_fecha_fin)
          : "Sin renta anticipada",
    },
    {
      name: "Renta Anticipada sin IVA",
      selector: (row: { renta_anticipada_renta_sin_iva?: number }) =>
        row.renta_anticipada_renta_sin_iva || 0,
      sortable: true,
      format: (row: { renta_anticipada_renta_sin_iva?: number }) =>
        row.renta_anticipada_renta_sin_iva
          ? formatCurrency(row.renta_anticipada_renta_sin_iva, "MXN")
          : "Sin renta anticipada",
    },
    {
      name: "Incremento Mes",
      selector: (row: { incremento_mes: string }) => row.incremento_mes,
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
      selector: (row: { inicio_vigencia: Date }) =>
        row.inicio_vigencia.toString(),
      sortable: true,
      format: (row: { inicio_vigencia: Date }) =>
        formatDateLatinAmerican(row.inicio_vigencia),
    },
    {
      name: "Fin Vigencia Forzosa",
      selector: (row: { fin_vigencia_forzosa: Date }) =>
        row.fin_vigencia_forzosa.toString(),
      sortable: true,
      format: (row: { fin_vigencia_forzosa: Date }) =>
        formatDateLatinAmerican(row.fin_vigencia_forzosa),
    },
    {
      name: "Fin Vigencia No Forzosa",
      selector: (row: { fin_vigencia_no_forzosa?: Date }) =>
        row.fin_vigencia_no_forzosa?.toString() || "",
      sortable: true,
      format: (row: { fin_vigencia_no_forzosa?: Date }) =>
        row.fin_vigencia_no_forzosa
          ? formatDateLatinAmerican(row.fin_vigencia_no_forzosa)
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
      {state.open && (
        <Modal
          isOpen={state.open}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        >
          <Form
            action={state.action}
            propiedades={propiedades}
            renta={state.selectedRenta}
            setOptimisticData={setOptimisticData}
            onClose={() => dispatch({ type: "CLOSE_MODAL" })}
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
      {rents.length > 0 ? (
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
          title="No se encontraron rentas"
          description="No se encontraron rentas en la base de datos."
        />
      )}
    </>
  );
};

export default RentsDataTable;
