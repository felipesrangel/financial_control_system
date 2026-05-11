export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface LaunchPaginationRequest extends PaginationRequest {
  startDate?: string | null;
  endDate?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}