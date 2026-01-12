import type { Address } from "@/api/types/address";
import type { ISODateString } from "@/api/types/global";
import type { OrderParty } from "@/api/types/order-party";
import type { Package } from "@/api/types/package";
import type { ShippingProvider } from "@/api/types/shipping-provider";

export interface Order {
  id: number;
  sender: OrderParty;
  recipient: OrderParty;
  fromAddress: Address;
  toAddress: Address;
  shippingProvider: ShippingProvider;
  createdAt: ISODateString;
  package: Package;
}

export type OrderFilters = Partial<{
  senderName: string;
  recipientName: string;
  fromAddress: string;
  toAddress: string;
}>;
