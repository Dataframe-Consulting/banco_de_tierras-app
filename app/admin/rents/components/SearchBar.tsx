"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";
import type { IPropiedad, IProyecto } from "@/app/shared/interfaces";

const SearchBar = ({
  propiedades,
  proyectos,
}: {
  propiedades: IPropiedad[];
  proyectos: IProyecto[];
}) => {
  const defaultFilters = { q: "", propiedad_id: "", proyecto_id: "" };

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
            id="propiedad_id"
            placeholder="Todos"
            ariaLabel="Propiedad"
            value={filters.propiedad_id}
            options={propiedades.map((propiedad) => ({
              value: propiedad.id.toString(),
              label: propiedad.nombre,
            }))}
            onChange={(value: string) => handleSearch("propiedad_id", value)}
          />
        </div>
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
      </div>
    </search>
  );
};

export default SearchBar;
