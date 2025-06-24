import { UserFilters } from "@/models/User";
import { buildUserFilterUrl } from "@/utils/filters";
import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  // Simula window.location.search
  vi.stubGlobal("window", {
    location: {
      search: "",
    },
  });
});

describe("buildUserFilterUrl", () => {
  it("devuelve solo la ruta base cuando los filtros son por defecto", () => {
    const filters: UserFilters = {
      searchTerm: undefined,
      status: undefined,
      page: 1,
      pageSize: 10,
      sort: "id",
      order: "desc",
    };
    const url = buildUserFilterUrl(filters);
    expect(url).toBe("/usuarios?");
  });

  it("agrega parámetros modificados respecto a los defaults", () => {
    const filters: UserFilters = {
      searchTerm: "leo",
      status: "ACTIVO",
      page: 2,
      pageSize: 20,
      sort: "usuario",
      order: "asc",
    };
    const url = buildUserFilterUrl(filters);
    expect(url).toContain("search=leo");
    expect(url).toContain("status=activo");
    expect(url).toContain("page=2");
    expect(url).toContain("size=20");
    expect(url).toContain("sort=usuario");
    expect(url).toContain("order=asc");
  });

  it("verificar que se elimina 'order' si sort es default", () => {
    const filters: UserFilters = {
      searchTerm: undefined,
      status: undefined,
      page: 1,
      pageSize: 10,
      sort: "id",
      order: "asc",
    };
    const url = buildUserFilterUrl(filters);
    expect(url).not.toContain("order=");
  });

  it("respeta los valores ya existentes en location.search", () => {
    vi.stubGlobal("window", {
      location: {
        search: "?otroparam=notengonadaquever",
      },
    });

    const filters: UserFilters = {
      searchTerm: "ana",
      status: undefined,
      page: 1,
      pageSize: 10,
      sort: "id",
      order: "desc",
    };

    const url = buildUserFilterUrl(filters);
    expect(url).toContain("otroparam=notengonadaquever");
    expect(url).toContain("search=ana");
  });

  it("agrega solo el filtro status si es diferente al default", () => {
    const filters: UserFilters = {
      searchTerm: undefined,
      status: "INACTIVO",
      page: 1,
      pageSize: 10,
      sort: "id",
      order: "desc",
    };
    const url = buildUserFilterUrl(filters);
    expect(url).toBe("/usuarios?status=inactivo");
  });
});
