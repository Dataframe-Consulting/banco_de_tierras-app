"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";

const SearchBar = () => {
  const defaultFilters = { q: "" };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-lg mx-auto mt-6 mb-4">
      <div className="flex flex-col md:flex-row gap-2 items-end">
        <GenericSearchInput
          type="text"
          inputClassName="h-full"
          value={filters.q}
          onChange={(value: string) => handleSearch("q", value)}
          placeholder="Busca por nombre del beneficiario..."
        />
      </div>
    </search>
  );
};

export default SearchBar;
