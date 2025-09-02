import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { WarningGraphic } from "@/components/ui/warning-graphic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-background/80 backdrop-blur-sm border-border/50 shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-8">
          <WarningGraphic 
            width={300} 
            height={100} 
            color="white"
            className="drop-shadow-lg" 
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
          <p className="text-white text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="pt-6 space-y-3">
            <Link to="/" className="block">
              <Button className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-xs text-white">
          Error Code: 404 • Route: {location.pathname}
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
