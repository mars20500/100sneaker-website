import { Toaster } from "@/components/ui/sonner";
import { Toaster as DefaultToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaultSiteContent } from "@/lib/siteContentService";
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
import AdminComments from "./pages/AdminComments";

const queryClient = new QueryClient();

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { content } = useSiteContent();
  const theme = content?.theme || defaultSiteContent.theme;

  return (
    <>
      <style>
        {`
          :root {
            --background: ${theme?.background};
            --foreground: ${theme?.foreground};
            --primary: ${theme?.primary};
            --primary-foreground: ${theme?.primaryForeground};
            --card: ${theme?.card};
            --card-foreground: ${theme?.cardForeground};
            --muted: ${theme?.muted};
            --muted-foreground: ${theme?.mutedForeground};
            --border: ${theme?.border};
            --radius: ${theme?.radius};
          }
        `}
      </style>
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <DefaultToaster />
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
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
                <Route path="comments" element={<AdminComments />} />
                <Route path="scout" element={<AdminScout />} />
                <Route path="site" element={<AdminSiteContent />} />
                <Route path="seed" element={<SeedBlog />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
