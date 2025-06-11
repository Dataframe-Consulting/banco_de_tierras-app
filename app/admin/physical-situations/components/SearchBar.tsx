"use client";

import { useSearchFilter } from "@/app/shared/hooks";
import { GenericSearchInput } from "@/app/shared/components";

const SearchBar = () => {
  const defaultFilters = { q: "" };

  const { filters, handleSearch } = useSearchFilter(defaultFilters);

  return (
    <search className="max-w-2xl mx-auto py-2">
      <div className="flex gap-2 items-end">
        <GenericSearchInput
          type="number"
          inputClassName="h-full"
          value={filters.q}
          onChange={(value: string) => handleSearch("q", value)}
          placeholder="Busca por valor de participación..."
        />
      </div>
    </search>
  );
};

export default SearchBar;
