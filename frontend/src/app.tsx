import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "@/app/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { RootLayout } from "@/layouts/root";
import { DashboardLayout } from "@/layouts/dashboard";
import { UploadSpreadsheet } from "@/app/dashboard/upload-spreadsheet";
import { Dashboard } from "@/app/dashboard";
import { Orders } from "@/app/dashboard/orders";
import { PageNotFound } from "@/app/error-pages/page-not-found";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="upload-spreadsheet" element={<UploadSpreadsheet />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
