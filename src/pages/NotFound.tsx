import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Floating particles */}
      <div className="particle" style={{ top: "15%", left: "10%", animationDelay: "0s", animationDuration: "5s" }} />
      <div className="particle" style={{ top: "25%", right: "15%", animationDelay: "1s", animationDuration: "6s" }} />
      <div className="particle" style={{ bottom: "30%", left: "20%", animationDelay: "2s", animationDuration: "4s" }} />
      <div className="particle" style={{ top: "60%", right: "25%", animationDelay: "0.5s", animationDuration: "7s" }} />
      <div className="particle" style={{ bottom: "15%", left: "45%", animationDelay: "1.5s", animationDuration: "5.5s" }} />
      <div className="particle" style={{ top: "10%", right: "40%", animationDelay: "3s", animationDuration: "4.5s", width: "4px", height: "4px" }} />
      <div className="particle" style={{ bottom: "25%", right: "10%", animationDelay: "2.5s", animationDuration: "6.5s", width: "8px", height: "8px" }} />

      {/* Gradient blobs */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative text-center px-4">
        <div className="text-404">404</div>
        <h2 className="mt-4 text-2xl font-bold md:text-3xl">Page not found</h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
          <Button size="lg" asChild>
            <Link to="/"><Home className="mr-2 h-4 w-4" /> Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
