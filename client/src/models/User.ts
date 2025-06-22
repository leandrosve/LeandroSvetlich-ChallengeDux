export default interface User {
  id: string;
  estado: string;
  sector: number;
  usuario: string;
}

export interface UserCreateRequest {
  id?: string | null;
  estado: string;
  sector: number;
  usuario: string;
}

export interface UserFilters {
  page: number;
  pageSize: number;
  searchTerm?: string;
  sort?: keyof User;
  order?: "asc" | "desc";
  id?: string;
}
