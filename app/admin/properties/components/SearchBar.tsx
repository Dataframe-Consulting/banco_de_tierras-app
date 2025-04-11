"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";
import type {
  IGarantia,
  IProyecto,
  IPropietario,
  ISociedad,
  IUbicacion,
  IProcesoLegal,
} from "@/app/shared/interfaces";

interface ISearchBar {
  proyectos: IProyecto[];
  garantias: IGarantia[];
  propietarios: IPropietario[];
  sociedades: ISociedad[];
  ubicaciones: IUbicacion[];
  procesosLegales: IProcesoLegal[];
}

const SearchBar = ({
  proyectos,
  garantias,
  propietarios,
  sociedades,
  ubicaciones,
  procesosLegales,
}: ISearchBar) => {
  const defaultFilters = {
    q: "",
    proyecto_id: "",
    garantia_id: "",
    propietario_id: "",
    sociedad_id: "",
    ubicacion_id: "",
    proceso_legal_id: "",
  };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-lg mx-auto mt-6 mb-4">
      <div className="flex flex-col md:flex-row gap-2 items-end">
        <div>
          <GenericSearchInput
            type="select"
            id="proyecto_id"
            placeholder="Todos"
            ariaLabel="Proyecto"
            value={filters.proyecto_id}
            options={proyectos.map((proyecto) => ({
              value: proyecto.id.toString(),
              label: proyecto.nombre,
            }))}
            onChange={(value: string) => handleSearch("proyecto_id", value)}
          />
        </div>
        <div>
          <GenericSearchInput
            type="select"
            id="propietario_id"
            placeholder="Todos"
            ariaLabel="Propietario"
            value={filters.propietario_id}
            options={propietarios.map((propietario) => ({
              value: propietario.id.toString(),
              label: propietario.nombre,
            }))}
            onChange={(value: string) => handleSearch("propietario_id", value)}
          />
        </div>
        <div>
          <GenericSearchInput
            type="select"
            id="sociedad_id"
            placeholder="Todas"
            ariaLabel="Sociedad"
            value={filters.sociedad_id}
            options={sociedades.map((sociedad) => ({
              value: sociedad.id.toString(),
              label: sociedad.porcentaje_participacion.toString(),
            }))}
            onChange={(value: string) => handleSearch("sociedad_id", value)}
          />
        </div>
        <div>
          <GenericSearchInput
            type="select"
            id="ubicacion_id"
            placeholder="Todas"
            ariaLabel="Ubicación"
            value={filters.ubicacion_id}
            options={ubicaciones.map((ubicacion) => ({
              value: ubicacion.id.toString(),
              label: ubicacion.nombre,
            }))}
            onChange={(value: string) => handleSearch("ubicacion_id", value)}
          />
        </div>
        <div>
          <GenericSearchInput
            type="select"
            id="garantia_id"
            placeholder="Todas"
            ariaLabel="Garantía"
            value={filters.garantia_id}
            options={garantias.map((garantia) => ({
              value: garantia.id.toString(),
              label: garantia.beneficiario,
            }))}
            onChange={(value: string) => handleSearch("garantia_id", value)}
          />
        </div>
        <div>
          <GenericSearchInput
            type="select"
            id="proceso_legal_id"
            placeholder="Todos"
            ariaLabel="Proceso Legal"
            value={filters.proceso_legal_id}
            options={procesosLegales.map((procesoLegal) => ({
              value: procesoLegal.id.toString(),
              label: procesoLegal.tipo_proceso,
            }))}
            onChange={(value: string) =>
              handleSearch("proceso_legal_id", value)
            }
          />
        </div>
      </div>
      <div className="mt-4">
        <GenericSearchInput
          type="text"
          inputClassName="h-full"
          value={filters.q}
          onChange={(value: string) => handleSearch("q", value)}
          placeholder="Busca por nombre..."
        />
      </div>
    </search>
  );
};

export default SearchBar;
