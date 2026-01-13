import type { SidebarItem } from "@/components/dashboard/sidebar/types";
import {
  TbDashboard,
  TbFileUpload,
  TbHistory,
  TbCoin,
  TbCreditCard,
  TbSettings,
  TbHelp,
  TbTagPlus,
} from "react-icons/tb";
import { routes } from "@/routes";

export const LINKS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: routes.dashboard.ROOT,
    icon: TbDashboard,
    end: true,
  },
  {
    label: "Create a label",
    href: routes.dashboard.CREATE_LABEL,
    icon: TbTagPlus,
  },
  {
    label: "Upload spreadsheet",
    href: routes.dashboard.UPLOAD_SPREADSHEET,
    icon: TbFileUpload,
  },
  {
    label: "Order history",
    href: routes.dashboard.ORDER_HISTORY,
    icon: TbHistory,
  },
  {
    label: "Pricing",
    href: routes.dashboard.PRICING,
    icon: TbCoin,
  },
  {
    label: "Billing",
    href: routes.dashboard.BILLING,
    icon: TbCreditCard,
  },
  {
    label: "Settings",
    href: routes.dashboard.SETTINGS,
    icon: TbSettings,
  },
  {
    label: "Support & help",
    href: routes.dashboard.SUPPORT,
    icon: TbHelp,
  },
];
