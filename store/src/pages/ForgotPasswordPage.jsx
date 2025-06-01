import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Simulate API call
      console.log("Sending reset link to:", email);
      // await axios.post("/api/auth/forgot-password", { email });

      setMessage("If this email exists, a password reset link has been sent.");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}
            </div>

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <a href="/signin" className="text-blue-500 hover:underline">
              Back to Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
