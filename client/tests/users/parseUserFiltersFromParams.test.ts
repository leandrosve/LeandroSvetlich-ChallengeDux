import { describe, it, expect } from "vitest";
import { parseUserFiltersFromParams } from "@/utils/filters"; // o la ruta correcta

describe("parseUserFiltersFromParams", () => {
  it("devuelve valores por defecto si params está vacío", () => {
    const result = parseUserFiltersFromParams({});
    expect(result).toEqual({
      page: 1,
      pageSize: 10,
      searchTerm: undefined,
      sort: "id",
      order: "desc",
      status: undefined,
    });
  });

  it("parsea correctamente params válidos", () => {
    const params = {
      page: "2",
      size: "20",
      search: "ana",
      sort: "name",
      order: "asc",
      status: "ACTIVO",
    };
    const result = parseUserFiltersFromParams(params);
    expect(result).toEqual({
      page: 2,
      pageSize: 20,
      searchTerm: "ana",
      sort: "name",
      order: "asc",
      status: "ACTIVO",
    });
  });

  it("usa pageSize 10 si size es inválido", () => {
    const params = { size: "15" };
    const result = parseUserFiltersFromParams(params);
    expect(result.pageSize).toBe(10);
  });

  it("ignora status no válido", () => {
    const params = { status: "PENDIENTE" };
    const result = parseUserFiltersFromParams(params);
    expect(result.status).toBeUndefined();
  });

  it("maneja order distinto a 'asc' o 'desc' con valor por defecto 'desc'", () => {
    const params = { order: "invalid" };
    const result = parseUserFiltersFromParams(params);
    expect(result.order).toBe("desc");
  });

  it("asigna sort por defecto cuando no es string", () => {
    const params = { sort: ["name"] };
    const result = parseUserFiltersFromParams(params);
    expect(result.sort).toBe("id");
  });

  it("convierte status a mayúsculas si es válido", () => {
    const params = { status: "activo" };
    const result = parseUserFiltersFromParams(params);
    expect(result.status).toBe("ACTIVO");
  });
});
