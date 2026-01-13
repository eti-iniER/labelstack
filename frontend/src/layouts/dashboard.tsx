import { useState } from "react";
import { Outlet } from "react-router";
import { DesktopSidebar, MobileSidebar } from "@/components/dashboard/sidebar";

export const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col">
      <main className="flex w-full flex-1 overflow-y-auto">
        <aside className="relative z-20 hidden h-full overflow-visible lg:flex">
          <DesktopSidebar />
        </aside>
        <section className="flex h-full flex-1 flex-col overflow-hidden p-4">
          <Outlet />
        </section>
      </main>
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
};
