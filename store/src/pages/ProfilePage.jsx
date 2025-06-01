import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const ProfilePage = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg">User not logged in.</p>
      </div>
    );
  }

  return (
   <>
   <Navbar/>
   <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
        
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user?.name} disabled />
            </div>
  
            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email} disabled />
            </div>
  
            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={user?.address} disabled />
            </div>
  
            {/* Role */}
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user?.role} disabled />
            </div>
  
            {/* Logout */}
            <Button variant="destructive" className="w-full mt-4" onClick={handleLogout}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
   </>
  );
};

export default ProfilePage;
