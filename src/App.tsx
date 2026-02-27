import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { RankProvider } from "@/context/rankData";
import MainRoutes from "./routes/routes";
import { StoreProvider } from "./context/storeData";
import LandingOverlay from "./components/LandingOverlay";


// const queryClient = new QueryClient();

const App = () => {

  return (
    // <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors />
      <BrowserRouter>
        <LandingOverlay />
        <RankProvider>
          <StoreProvider>
            <MainRoutes />
          </StoreProvider>
        </RankProvider>
      </BrowserRouter>
    </TooltipProvider>
    // </QueryClientProvider>
  );
};

export default App;
