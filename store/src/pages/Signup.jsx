import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const { name, email, address, password } = form;

    if (name.length < 3 || name.length > 60) {
      newErrors.name = "Name must be between 3 and 60 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (address.length > 400) {
      newErrors.address = "Address must be less than 400 characters";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8-16 characters, include one uppercase and one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", form);
      toast.error("Registration Successful. Please Log in", {
       position:"top-center",
       duration:5000,  
      })
      navigate("/signin");
    } catch (err) {
     toast.error("Registration failed. Please try again.", {
      description: (
        <span className="text-red-600 font-semibold">
          { err.response.data.message }
        </span>
      ),     position:"top-center",
     duration:5000,
     icon:"❌",

    })
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={form.email} onChange={handleChange} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
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

            <Button type="submit" className="w-full">Register</Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span>Already have an account? </span>
            <Link to="/signin" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
