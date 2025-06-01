import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <Card className="max-w-md w-full shadow-lg border-red-200">
        <CardHeader>
          <CardTitle className="text-center text-red-600 text-2xl">
            403 - Unauthorized
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-700">
            You don't have permission to access this page.
          </p>
          <Button variant="default" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
