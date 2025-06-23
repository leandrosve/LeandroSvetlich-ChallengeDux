"use client";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "primereact/button";
import { UserFilters } from "@/models/User";
import { buildUserFilterUrl } from "@/utils/filters";

export default function UserSearchBar({ filters }: { filters: UserFilters }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm ?? "");

  const ref = useRef<HTMLInputElement>(null);
  const [debouncedSearchTerm, setDebouncedTerm] = useDebounce(searchTerm, 500);
  const currentSearchTerm = filters.searchTerm;

  useEffect(() => {
    setSearchTerm(filters.searchTerm ?? "");
  }, [filters]);

  const updateURL = useCallback(
    (term: string) => {
      const path = buildUserFilterUrl({ ...filters, searchTerm: term.trim() });
      router.replace(path, { scroll: false });
    },
    [router, filters]
  );

  const clearInput = useCallback(() => {
    setSearchTerm("");
    setDebouncedTerm("");
    ref.current?.focus();
  }, [ref, setDebouncedTerm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentSearchTerm == debouncedSearchTerm) return;
    if (!currentSearchTerm && !debouncedSearchTerm) return;
    updateURL(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="inline-flex  border-1 border-round-md relative overflow-hidden border-subtle w-full md:w-25rem">
      <IconField iconPosition="left" className="w-full">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          className="w-full border-noround-right border-none"
          placeholder="Buscar"
          ref={ref}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </IconField>

      {searchTerm && (
        <div className="absolute right-0 t-0 w-3em h-full top-0">
          <Button
            icon="pi pi-times"
            text
            severity="secondary"
            className={`border-noround-left  `}
            onClick={clearInput}
          />
        </div>
      )}
    </div>
  );
}
