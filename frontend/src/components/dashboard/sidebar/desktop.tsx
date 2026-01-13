import { useLocalStorage } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LINKS } from "./links";

const SIDEBAR_COLLAPSED_KEY = "dashboard-sidebar-collapsed";

export const DesktopSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    SIDEBAR_COLLAPSED_KEY,
    false,
  );

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={cn(
        "relative z-20 hidden h-full flex-col border-r bg-white py-[0.35rem] transition-[width] duration-300 ease-in-out lg:flex",
        isCollapsed ? "w-18" : "w-52",
      )}
    >
      <Button
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
        className="absolute top-2/5 -right-3 z-10 h-6 w-6 text-gray-600 shadow-md"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <TbChevronRight className="h-3.5 w-3.5" />
        ) : (
          <TbChevronLeft className="h-3.5 w-3.5" />
        )}
      </Button>

      <div className="flex flex-1 flex-col gap-1 overflow-hidden p-4">
        {LINKS.map((link) => {
          const linkElement = (
            <NavLink
              to={link.href}
              end={link.end}
              target={link.openInNewTab ? "_blank" : "_self"}
              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {({ isActive }) => (
                <div
                  className={cn(
                    "flex items-center rounded-md px-3 py-2.5 text-sm transition-colors",
                    isCollapsed ? "w-10 justify-center" : "gap-3",
                    isActive
                      ? "bg-amber-100 hover:bg-amber-100"
                      : "hover:bg-accent",
                    !isCollapsed && isActive && "text-amber-700",
                  )}
                >
                  <link.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-amber-600" : "text-muted-foreground",
                    )}
                  />
                  <AnimatePresence initial={false} mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </NavLink>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={link.label}>
                <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-2"
                >
                  {link.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <React.Fragment key={link.label}>{linkElement}</React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
