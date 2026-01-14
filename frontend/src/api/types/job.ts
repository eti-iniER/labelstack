import type { ISODateString, Money } from "@/api/types/global";

export interface Job {
  id: number;
  createdAt: ISODateString;
  orders: number[];
  totalCost: Money;
}
