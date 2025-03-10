"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";
import type {
  IVocacion,
  ISociedad,
  IPropietario,
  IVocacionEspecifica,
  ISituacionFisica,
} from "@/app/shared/interfaces";

interface ISearchBar {
  vocaciones: IVocacion[];
  sociedades: ISociedad[];
  propietarios: IPropietario[];
  situacionesFisicas: ISituacionFisica[];
  vocacionesEspecificas: IVocacionEspecifica[];
}

const SearchBar = ({
  vocaciones,
  sociedades,
  propietarios,
  situacionesFisicas,
  vocacionesEspecificas,
}: ISearchBar) => {
  const defaultFilters = {
    q: "",
    sociedad_id: "",
    vocacion_id: "",
    propietario_id: "",
    situacion_fisica_id: "",
    vocacion_especifica_id: "",
  };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-lg mx-auto mt-6 mb-4">
      <div className="flex flex-col md:flex-row gap-2 items-end">
        <GenericSearchInput
          type="text"
          inputClassName="h-full"
          value={filters.q}
          onChange={(value: string) => handleSearch("q", value)}
          placeholder="Busca por nombre comercial o razon social..."
        />
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
            id="situacion_fisica_id"
            placeholder="Todas"
            ariaLabel="Situación Física"
            value={filters.situacion_fisica_id}
            options={situacionesFisicas.map((situacionFisica) => ({
              value: situacionFisica.id.toString(),
              label: situacionFisica.nombre,
            }))}
            onChange={(value: string) =>
              handleSearch("situacion_fisica_id", value)
            }
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
            id="vocacion_id"
            placeholder="Todas"
            ariaLabel="Vocación"
            value={filters.vocacion_id}
            options={vocaciones.map((vocacion) => ({
              value: vocacion.id.toString(),
              label: vocacion.valor,
            }))}
            onChange={(value: string) => handleSearch("vocacion_id", value)}
          />
        </div>
        <div>
          <GenericSearchInput
            type="select"
            id="vocacion_especifica_id"
            placeholder="Todas"
            ariaLabel="Vocación Específica"
            value={filters.vocacion_especifica_id}
            options={vocacionesEspecificas.map((vocacionEspecifica) => ({
              value: vocacionEspecifica.id.toString(),
              label: vocacionEspecifica.valor,
            }))}
            onChange={(value: string) =>
              handleSearch("vocacion_especifica_id", value)
            }
          />
        </div>
      </div>
    </search>
  );
};

export default SearchBar;
