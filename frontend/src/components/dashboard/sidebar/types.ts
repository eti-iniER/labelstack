import type { IconType } from "react-icons";

export interface SidebarItem {
  label: string;
  icon: IconType;
  href: string;
  end?: boolean;
  openInNewTab?: boolean;
}
