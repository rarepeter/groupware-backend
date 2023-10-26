interface IPagination {
  page: number;
  limit: number;
}

interface IOffsetPagination {
  limit: number;
  offset: number;
}

export type { IPagination, IOffsetPagination };
