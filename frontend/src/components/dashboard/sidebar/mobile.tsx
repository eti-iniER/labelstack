import { TbX } from "react-icons/tb";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LINKS } from "./links";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <TbX className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              onClick={onClose}
              target={link.openInNewTab ? "_blank" : "_self"}
              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                    : "hover:bg-accent",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive && "text-amber-600",
                    )}
                  />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
