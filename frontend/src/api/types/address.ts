export interface Address {
  id: number;
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isUserCreated: boolean;
}

export type AddressFilters = Partial<{
  isUserCreated: boolean;
}>;
