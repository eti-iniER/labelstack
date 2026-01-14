export interface Package {
  id: number;
  length: number; // in inches
  width: number; // in inches
  height: number; // in inches
  weight: number; // in ounces
  itemSku: string;
  isUserCreated: boolean;
}

export type PackageFilters = Partial<{
  isUserCreated: boolean;
}>;
