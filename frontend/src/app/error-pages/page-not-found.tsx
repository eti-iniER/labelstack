import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { logoColor } from "@/constants/images";

export const PageNotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-4">
      <img src={logoColor} alt="Logo" className="mb-8 h-16 opacity-60" />

      <h1 className="mb-2 text-8xl font-bold text-amber-600">404</h1>

      <p className="mb-1 text-xl font-medium text-amber-800">Page not found</p>

      <p className="mb-8 text-center text-amber-700/70">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Button asChild className="bg-amber-600 hover:bg-amber-700">
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
};
