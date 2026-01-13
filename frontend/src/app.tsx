import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "@/app/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { RootLayout } from "@/layouts/root";
import { DashboardLayout } from "@/layouts/dashboard";
import { UploadSpreadsheet } from "@/app/dashboard/upload-spreadsheet";
import { Dashboard } from "@/app/dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload-spreadsheet" element={<UploadSpreadsheet />} />
        </Route>
      </Route>
    </Routes>
  );
};

function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
