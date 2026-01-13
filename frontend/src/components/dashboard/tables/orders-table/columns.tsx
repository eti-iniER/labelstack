import type { Order } from "@/api/types/orders";
import type { ColumnDef } from "@tanstack/react-table";
import { convertOzToLbsOz } from "@/lib/utils";
import { ActionsCell } from "./actions";

export const ordersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    size: 100,
    cell: ({ row }) => (
      <div className="pt-0.5 font-mono">{row.original.id}</div>
    ),
  },
  {
    id: "sender",
    header: "Sender",
    size: 150,
    cell: ({ row }) => {
      const { sender } = row.original;
      return (
        <div>
          {sender.firstName} {sender.lastName}
        </div>
      );
    },
  },
  {
    id: "recipient",
    header: "Recipient",
    size: 150,
    cell: ({ row }) => {
      const { recipient } = row.original;
      return (
        <div>
          {recipient.firstName} {recipient.lastName}
        </div>
      );
    },
  },
  {
    id: "fromAddress",
    header: "From",
    size: 200,
    cell: ({ row }) => {
      const { fromAddress } = row.original;
      return (
        <div className="text-sm">
          <div>
            {fromAddress.city}, {fromAddress.state}
          </div>
          <div className="text-muted-foreground">{fromAddress.zipCode}</div>
        </div>
      );
    },
  },
  {
    id: "toAddress",
    header: "To",
    size: 200,
    cell: ({ row }) => {
      const { toAddress } = row.original;
      return (
        <div className="text-sm">
          <div>
            {toAddress.city}, {toAddress.state}
          </div>
          <div className="text-muted-foreground">{toAddress.zipCode}</div>
        </div>
      );
    },
  },
  {
    id: "package",
    header: "Package",
    size: 150,
    cell: ({ row }) => {
      const { package: pkg } = row.original;
      const weight = convertOzToLbsOz(pkg.weight);
      const weightDisplay =
        weight.lbs === 0
          ? `${weight.oz} oz`
          : `${weight.lbs} lbs ${weight.oz} oz`;
      return (
        <div className="text-sm">
          <div>
            {pkg.length}" × {pkg.width}" × {pkg.height}"
          </div>
          <div className="text-muted-foreground">{weightDisplay}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 150,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-sm">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    size: 80,
    cell: ({ row }) => <ActionsCell order={row.original} />,
  },
];
