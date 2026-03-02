import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Scout from "./pages/Scout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogPosts from "./pages/AdminBlogPosts";
import AdminScout from "./pages/AdminScout";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import SeedBlog from "./pages/SeedBlog";
import BlogPost from "./pages/BlogPost";
import AdminSiteContent from "./pages/AdminSiteContent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/scout" element={<Scout />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            <Route path="blog" element={<AdminBlogPosts />} />
              <Route path="scout" element={<AdminScout />} />
              <Route path="site" element={<AdminSiteContent />} />
              <Route path="seed" element={<SeedBlog />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
