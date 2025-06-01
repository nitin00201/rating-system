import { useEffect, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import React from "react";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Navbar = () => {
  const { user, logout, token } = useUserStore();
  const navigate = useNavigate();

  // console.log();


  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleLogout = () => {
    logout();
    navigate('/signin', { replace: true });

  };

  const handleUpdatePassword = () => {
    setIsDrawerOpen(true);
  };

  const handleProfileDetails = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    navigate("/settings");
  };


  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));

    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
      errors.newPassword = "Password must include uppercase letter and special character";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) {
      toast.error("Password Validation Failed", {
        position:"top-center",
        duration:5000,  
       })
        return;
    }
    if (validatePasswordForm()) {
      console.log("Password update requested:", passwordForm);
      const response = await axios.patch('http://localhost:4000/api/auth/update-password', {
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('password response is', response.data);
      toast.success("Password Updated Successfully", {
        position:"top-center",
        duration:5000,  
       })
        setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setIsDrawerOpen(false);
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/20'
        : 'bg-white/70 backdrop-blur-md'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Ratingo
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Calculate your ratings</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-1 hover:bg-gray-100 transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 border-2 border-transparent group-hover:border-blue-200 transition-all duration-200">
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}

                          </div>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-xl">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <DropdownMenuItem
                      onClick={handleProfileDetails}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile Details</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleSettings}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleUpdatePassword}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v0" />
                      </svg>
                      <span>Update Password</span>
                    </DropdownMenuItem>

                    <div className="border-t border-gray-100 my-2"></div>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-full mx-auto">
          <DrawerHeader className="text-center pb-4 ">
            <DrawerTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-center">
              Update Password
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 mt-2 text-center">
              Choose a strong password to keep your account secure
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mb-2 block">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {passwordErrors.newPassword}
                  </p>
                )}

              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-2 block">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DrawerFooter className="flex flex-col space-3">
            <Button
              onClick={handlePasswordSubmit}
            >
              Update Password
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDrawerClose}
              >
                Cancel
              </Button>
            </DrawerClose>

          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;