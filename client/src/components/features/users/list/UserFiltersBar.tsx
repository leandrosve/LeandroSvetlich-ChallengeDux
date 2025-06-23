"use client";
import UserSearchBar from "./UserSearchBar";
import UserStatusFilter from "./UserStatusFilter";
import { UserFilters } from "@/models/User";
import { LinkButton } from "@/components/common/LinkButton";

const UserFiltersBar = ({ filters }: { filters: UserFilters }) => {
  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      <UserSearchBar filters={filters} />
      <UserStatusFilter filters={filters} />
      {(!!filters.searchTerm || !!filters.status) && (
        <LinkButton href="/usuarios" icon="pi-filter-slash">
          Limpiar Filtros
        </LinkButton>
      )}
    </div>
  );
};

export default UserFiltersBar;
