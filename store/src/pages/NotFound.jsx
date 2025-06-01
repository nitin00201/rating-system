import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 py-12 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <p className="mt-2 text-gray-500">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate("/")} variant="default">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
