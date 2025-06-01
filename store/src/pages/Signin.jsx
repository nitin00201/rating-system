import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import useUserStore from "../store/userStore";

const SignInPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser, setToken, token, user } = useUserStore();


  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", form);
      const { token, role } = res.data;

      setToken(token);
      toast.success("Logged in Successfully", {
        position: "top-center",
        duration: 5000,
      })
      const userData = await axios.get("http://localhost:4000/api/auth/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(userData?.data?.user);
      console.log("user data is", userData?.data?.user);
      toast.success("Profile fetched successfully", {
        position: "top-center",
        duration: 5000,
      })

      const finalRole = userData?.data?.user?.role;

      if (finalRole === "SYSTEM_ADMINISTRATOR") navigate("/admin/dashboard", { replace: true });
      else if (finalRole === "STORE_OWNER") navigate("/store-owner/dashboard", { replace: true });
      else navigate("/stores", { replace: true });

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full">Sign In</Button>
          </form>

          <div className="mt-4 flex justify-between text-sm">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
