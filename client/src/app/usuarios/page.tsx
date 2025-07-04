import UserCreateButton from "@/components/features/users/form/UserCreateButton";
import UsersDataLoader from "@/components/features/users/UsersDataLoader";
import { UserTableSkeleton } from "@/components/features/users/list/UserTable";
import { parseUserFiltersFromParams } from "@/utils/filters";
import { Suspense } from "react";
import UserFiltersBar from "@/components/features/users/list/UserFiltersBar";
import { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorPage from "../error";

export const metadata: Metadata = {
  title: "Listado de Usuarios - Dux Software",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const filters = parseUserFiltersFromParams(searchParams);
  return (
    <div className="p-2 px-4 flex flex-column min-h-full">
      <div className="mb-2 flex justify-content-between align-items-center flex-wrap row-gap-4 column-gap-1">
        <h1>Usuarios</h1>
        <UserCreateButton />
      </div>
      <UserFiltersBar filters={filters} />
      <ErrorBoundary errorComponent={ErrorPage}>
        <Suspense key={JSON.stringify(filters)} fallback={<UserTableSkeleton rows={filters.pageSize} />}>
          <UsersDataLoader filters={filters} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
