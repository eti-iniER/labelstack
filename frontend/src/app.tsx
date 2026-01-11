import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "@/app/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
