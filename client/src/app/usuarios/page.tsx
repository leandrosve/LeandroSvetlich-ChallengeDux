import UserListRetriever from "@/components/features/users/UserListRetriever";
import UserSearchBar from "@/components/features/users/UserSearchBar";
import { parseUserFiltersFromParams } from "@/utils/filters";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Suspense } from "react";

export default function UsersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const filters = parseUserFiltersFromParams(searchParams);
  return (
    <div className="p-2 px-4 flex flex-column min-h-full">
      <div className="mb-4 flex justify-content-between align-items-center">
        <h1>Usuarios</h1>
        <Button label="Nuevo Usuario" icon="pi pi-plus" />
      </div>
      <div className="mb-4 flex justify-content-between">
        <UserSearchBar filters={filters} />
      </div>

      <Suspense
        key={JSON.stringify(filters)}
        fallback={
          <div className="gap-2 flex flex-column align-items-stretch w-full flex-grow-1 pb-2">
            <Skeleton width="full" height="4rem" />
            <Skeleton width="full" height="25rem" />
            <div className="flex-grow-1"></div>
            <Skeleton
              width="40rem"
              height="3rem"
              className="max-w-full align-self-center"
            />
          </div>
        }
      >
        <UserListRetriever filters={filters} />
      </Suspense>
    </div>
  );
}
