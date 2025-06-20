import Alert from "@/components/common/Alert";
import UserCreateButton from "@/components/features/users/create/UserCreateButton";
import UsersDataLoader from "@/components/features/users/UsersDataLoader";
import UserSearchBar from "@/components/features/users/UserSearchBar";
import { UserTableSkeleton } from "@/components/features/users/UserTable";
import UserService from "@/services/UserService";
import { parseUserFiltersFromParams } from "@/utils/filters";
import { Skeleton } from "primereact/skeleton";
import { Suspense } from "react";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const filters = parseUserFiltersFromParams(searchParams);

  return (
    <div className="p-2 px-4 flex flex-column min-h-full">
      <div className="mb-4 flex justify-content-between align-items-center">
        <h1>Usuarios</h1>
        <UserCreateButton />
      </div>
      <div className="mb-4 flex justify-content-between">
        <UserSearchBar filters={filters} />
      </div>
      <Suspense key={JSON.stringify(filters)} fallback={<UserTableSkeleton />}>
        <UsersDataLoader filters={filters} />
      </Suspense>
    </div>
  );
}
