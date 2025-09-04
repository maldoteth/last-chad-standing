
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import Blog from "./pages/Blog";
import Game from "./pages/Game";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PreOrderSuccess from "./pages/PreOrderSuccess";
import PreOrderCancel from "./pages/PreOrderCancel";
import { AdminLogin } from "./components/AdminLogin";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/docs" element={<Documents />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/preorder-success" element={<PreOrderSuccess />} />
          <Route path="/preorder-cancel" element={<PreOrderCancel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <PWAInstallPrompt />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
