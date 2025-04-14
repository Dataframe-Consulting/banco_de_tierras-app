"use client";

import Form from "./Form";
import cn from "@/app/shared/utils/cn";
import { RentsDataTable } from "./Rentas";
import { useModal } from "@/app/shared/hooks";
import formatCurrency from "@/app/shared/utils/format-currency";
import { ExpanderComponentProps } from "react-data-table-component";
import { EyeIcon, PencilIcon, PlusCircle, TrashIcon } from "@/app/shared/icons";
import { useEffect, useOptimistic, useReducer, useState } from "react";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { PropertiesGuaranteesForm, GarantiasDataTable } from "./Garantias";
import { PropertiesLocationsForm, UbicacionesDataTable } from "./Ubicaciones";
import {
  Modal,
  Card404,
  Datatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import {
  PropietariosSociedadesDataTable,
  PropiedadPropietarioSociedadForm,
} from "./Propietarios_Sociedades";
import {
  PropertiesLegalProcessesForm,
  ProcesosLegalesDataTable,
} from "./ProcesosLegales";
import type {
  IProyecto,
  IGarantia,
  ISociedad,
  IUbicacion,
  IPropiedad,
  IPropietario,
  IProcesoLegal,
} from "@/app/shared/interfaces";

interface State {
  open: boolean;
  action: "view" | "add" | "edit" | "delete";
  selectedData: IPropiedad | null;
}

type Action =
  | {
      type: "OPEN_MODAL";
      payload: {
        action: "view" | "add" | "edit" | "delete";
        data: IPropiedad | null;
      };
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
  propietarios: IPropietario[];
  sociedades: ISociedad[];
  ubicaciones: IUbicacion[];
  propiedades: IPropiedad[];
  procesosLegales: IProcesoLegal[];
  refresh: () => void;
}

const PropertiesDataTable = ({
  proyectos,
  garantias,
  propietarios,
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
    action: "view" | "add" | "edit" | "delete"
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
      width: "265px",
      cell: (row: IPropiedad) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleAction(row, "view")}
            className="px-4 py-2 text-white bg-gray-400 rounded-md"
          >
            <EyeIcon />
          </button>
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
      | "rentas"
      | "propietarios_sociedades"
      | "ubicaciones"
      | "garantias"
      | "procesos_legales"
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
              onClick={() => setTab("propietarios_sociedades")}
              className={cn(
                "px-4 py-2 rounded-md",
                tab === "propietarios_sociedades"
                  ? "bg-[#C23B2E] text-white"
                  : "bg-gray-200 text-gray-700"
              )}
            >
              Propietarios/Socios - Sociedades
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
        {tab === "propietarios_sociedades" && (
          <PropietariosSociedadesDataTable
            propietario_sociedad={data.propietarios_sociedades}
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
            propietarios={propietarios}
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
          <>
            {state.action !== "view" ? (
              <Form
                action={state.action}
                propiedad={state.selectedData}
                setOptimisticData={setOptimisticData}
                onClose={() => dispatch({ type: "CLOSE_MODAL" })}
                proyectos={proyectos}
                propietarios={propietarios}
                sociedades={sociedades}
                ubicaciones={ubicaciones}
                garantias={garantias}
                procesosLegales={procesosLegales}
                refresh={refresh}
              />
            ) : (
              <FullDetails propiedad={state.selectedData!} />
            )}
          </>
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
  propietarios: IPropietario[];
  sociedades: ISociedad[];
  ubicaciones: IUbicacion[];
  procesosLegales: IProcesoLegal[];
  onClose: () => void;
  refresh: () => void;
}

const AddMenu = ({
  propiedad,
  garantias,
  propietarios,
  sociedades,
  ubicaciones,
  procesosLegales,
  onClose,
  refresh,
}: IAddMenu) => {
  const [tab, setTab] = useState<
    "propietarios_sociedades" | "ubicaciones" | "garantias" | "procesos_legales"
  >("propietarios_sociedades");

  return (
    <div className="py-4 overflow-x-auto">
      <ul className="flex flex-row gap-4 mb-4">
        <li>
          <button
            onClick={() => setTab("propietarios_sociedades")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "propietarios_sociedades"
                ? "bg-[#C23B2E] text-white"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Propietarios/Socios - Sociedades
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
      {tab === "propietarios_sociedades" && (
        <PropiedadPropietarioSociedadForm
          action="add"
          propiedadId={propiedad.id}
          propietarios={propietarios.filter(
            (propietario) =>
              !propiedad.propietarios_sociedades
                .map((p) => p.propietario_id)
                .includes(propietario.id)
          )}
          sociedades={sociedades}
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

interface IFullDetails {
  propiedad: IPropiedad;
}

const FullDetails = ({ propiedad }: IFullDetails) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {propiedad.nombre}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Proyecto: {propiedad.proyecto?.nombre}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-sm">Superficie</p>
          <p className="font-semibold">{propiedad.superficie} m²</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Valor comercial</p>
          <p className="font-semibold">
            {formatCurrency(propiedad.valor_comercial, "MXN")}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Clave catastral</p>
          <p className="font-semibold">{propiedad.clave_catastral}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Base predial</p>
          <p className="font-semibold">
            {formatCurrency(propiedad.base_predial, "MXN")}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Situación física</p>
          <p className="font-semibold">
            {propiedad.proyecto?.situacion_fisica?.nombre}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Vocación</p>
          <p className="font-semibold">
            {propiedad.proyecto?.vocacion?.valor} /{" "}
            {propiedad.proyecto?.vocacion_especifica?.valor}
          </p>
        </div>
        <div className="col-span-2 md:col-span-3">
          <p className="text-gray-500 text-sm">Comentarios</p>
          <p className="font-semibold">
            {propiedad.comentarios || "Sin comentarios"}
          </p>
        </div>
      </div>

      {/* Propietarios */}
      {propiedad.propietarios_sociedades.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Propietarios / Sociedades
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {propiedad.propietarios_sociedades.map((ps, idx) => (
              <li
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between"
              >
                <span>
                  {ps.propietario.nombre} {ps.es_socio && "(Socio)"}
                </span>
                <span className="text-gray-500 text-xs">
                  Participación: {ps.sociedad?.porcentaje_participacion}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ubicaciones */}
      {propiedad.ubicaciones.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Ubicaciones
          </h3>
          <p className="text-sm text-gray-700">
            {propiedad.ubicaciones.map((u) => u.nombre).join(", ")}
          </p>
        </div>
      )}

      {/* Rentas */}
      {propiedad.rentas.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Rentas</h3>
          {propiedad.rentas.map((renta) => (
            <div key={renta.id} className="bg-gray-50 p-3 rounded-lg mb-2">
              <p className="text-sm">
                <span className="font-semibold">Nombre comercial:</span>{" "}
                {renta.nombre_comercial}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Razón social:</span>{" "}
                {renta.razon_social}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Renta mensual:</span>{" "}
                {formatCurrency(renta.renta_sin_iva, "MXN")}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Vigencia:</span>{" "}
                {new Date(renta.inicio_vigencia).toLocaleDateString()} -{" "}
                {new Date(
                  renta.fin_vigencia_no_forzosa ?? ""
                ).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Garantías */}
      {propiedad.garantias.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Garantías
          </h3>
          {propiedad.garantias.map((g) => (
            <div key={g.id} className="text-sm text-gray-700 mb-1">
              <p>
                Beneficiario: {g.beneficiario} - Monto:{" "}
                {formatCurrency(g.monto, "MXN")}
              </p>
              <p>
                Vigencia: {new Date(g.fecha_inicio).toLocaleDateString()} -{" "}
                {new Date(g.fecha_fin).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Procesos legales */}
      {propiedad.procesos_legales.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Procesos legales
          </h3>
          {propiedad.procesos_legales.map((p) => (
            <div key={p.id} className="text-sm text-gray-700 mb-1">
              <p>Abogado: {p.abogado}</p>
              <p>
                Tipo: {p.tipo_proceso} - Estatus: {p.estatus}
              </p>
              {p.comentarios && <p>Comentarios: {p.comentarios}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
