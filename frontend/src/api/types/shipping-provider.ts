import type { Money } from "@/api/types/global";

export interface ShippingProvider {
  id: number;
  name: string;
  description: string;
  costPerPound: Money;
}
