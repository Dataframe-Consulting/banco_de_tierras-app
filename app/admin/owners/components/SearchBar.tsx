"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";
import type { ISocio } from "@/app/shared/interfaces";

const SearchBar = ({ socios }: { socios: ISocio[] }) => {
  const defaultFilters = { q: "", socio_id: "" };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-lg mx-auto mt-6 mb-4">
      <div className="flex flex-col md:flex-row gap-2 items-end">
        <GenericSearchInput
          type="text"
          inputClassName="h-full"
          value={filters.q}
          onChange={(value: string) => handleSearch("q", value)}
          placeholder="Busca por abogado..."
        />
        <div>
          <GenericSearchInput
            type="select"
            id="socio_id"
            placeholder="Todos"
            ariaLabel="Socio"
            value={filters.socio_id}
            options={socios.map((socio) => ({
              value: socio.id.toString(),
              label: socio.nombre,
            }))}
            onChange={(value: string) => handleSearch("socio_id", value)}
          />
        </div>
      </div>
    </search>
  );
};

export default SearchBar;
