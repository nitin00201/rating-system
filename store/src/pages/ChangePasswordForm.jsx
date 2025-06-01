import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const ChangePasswordForm = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;

    if (!form.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordRegex.test(form.newPassword)) {
      newErrors.newPassword =
        "New password must be 8-16 characters, include one uppercase letter and one special character";
    }

    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (validate()) {
      try {
        // Replace this with your API call
        console.log("Password change request:", form);
        // await axios.post("/api/change-password", form);

        setMessage("Password changed successfully ✅");
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        setErrors({ api: "Something went wrong. Try again." });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Update Password
            </Button>

            {/* Status Messages */}
            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {errors.api && <p className="text-red-500 text-sm text-center">{errors.api}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
