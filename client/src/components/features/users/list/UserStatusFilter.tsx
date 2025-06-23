"use client";
import { UserFilters } from "@/models/User";
import { buildUserFilterUrl } from "@/utils/filters";
import { useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import { useCallback } from "react";

const statuses = [
  {
    name: "Todos los estados",
    value: "TODOS",
  },
  {
    name: "Activo",
    value: "ACTIVO",
  },
  {
    name: "Inactivo",
    value: "INACTIVO",
  },
];

const valueTemplate = (option: { name: string; value: string }) => {
  return (
    <div className="flex align-items-center gap-2 w-14rem">
      <span className="pi pi-filter" />
      {option ? <div>{option.name}</div> : <span>Todos los estados</span>}
    </div>
  );
};

const UserStatusFilter = ({ filters }: { filters: UserFilters }) => {
  const router = useRouter();

  const updateURL = useCallback(
    (status: string) => {
      const sanitizedStatus = status == "TODOS" ? undefined : status;
      const path = buildUserFilterUrl({
        ...filters,
        status: sanitizedStatus,
        page: 1,
      });
      router.replace(path, { scroll: false });
    },
    [router, filters]
  );

  return (
    <Dropdown
      value={filters.status ?? ""}
      options={statuses}
      optionLabel="name"
      placeholder="Estado"
      className=" w-full md:w-15rem"
      onChange={(e) => updateURL(e.value)}
      valueTemplate={valueTemplate}
    />
  );
};

export default UserStatusFilter;
