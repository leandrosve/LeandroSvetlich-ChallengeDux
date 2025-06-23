import UserCreateButton from "@/components/features/users/create/UserCreateButton";
import UsersDataLoader from "@/components/features/users/UsersDataLoader";
import UserSearchBar from "@/components/features/users/list/UserSearchBar";
import { UserTableSkeleton } from "@/components/features/users/list/UserTable";
import { parseUserFiltersFromParams } from "@/utils/filters";
import { Suspense } from "react";
import { Dropdown } from "primereact/dropdown";
import UserStatusFilter from "@/components/features/users/list/UserStatusFilter";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const filters = parseUserFiltersFromParams(searchParams);
  const key = new Date().getTime();
  return (
    <div className="p-2 px-4 flex flex-column min-h-full">
      <div className="mb-4 flex justify-content-between align-items-center">
        <h1>Usuarios</h1>

        <UserCreateButton />
      </div>
      <div className="mb-4 flex gap-2">
        <UserSearchBar filters={filters} />
        <UserStatusFilter filters={filters} />
      </div>
      <Suspense key={key} fallback={<UserTableSkeleton />}>
        <UsersDataLoader filters={filters} />
      </Suspense>
    </div>
  );
}
