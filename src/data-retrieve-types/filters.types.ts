type TSortBy = 'asc' | 'desc';

interface ISortFilters<T> {
  sortBy: TSortBy;
  orderBy: [keyof T];
}

export { ISortFilters, TSortBy };
