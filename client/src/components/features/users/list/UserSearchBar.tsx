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

  const updateURL = useCallback(
    (term: string) => {
      const path = buildUserFilterUrl({ ...filters, searchTerm: term.trim() });
      router.replace(path, { scroll: false });
    },
    [router, filters]
  );

  // Uso este ref para que usarlo dentro del useEffect, sin que genere triggers indeseados
  const updateURLRef = useRef(updateURL);
  const currentSearchTermRef = useRef(filters.searchTerm);

  useEffect(() => {
    const term = filters.searchTerm ?? "";
    currentSearchTermRef.current = term;
    setSearchTerm(term);
  }, [filters]);

  const clearInput = useCallback(() => {
    setSearchTerm("");
    setDebouncedTerm("");
    ref.current?.focus();
  }, [ref, setDebouncedTerm]);

  useEffect(() => {
    updateURLRef.current = updateURL;
  }, [updateURL]);

  useEffect(() => {
    const term = currentSearchTermRef.current;
    if (term == debouncedSearchTerm) return;
    if (!term && !debouncedSearchTerm) return;
    updateURLRef.current(debouncedSearchTerm);
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
