import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  User, 
  Mail, 
  MapPin, 
  Shield, 
  Star, 
  Edit, 
  ArrowLeft,
  Phone,
  Calendar,
  Activity
} from "lucide-react";
import useUserStore from "../store/userStore";
import Navbar from "../components/shared/Navbar";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        console.log("user found ", res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "STORE_OWNER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "USER":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center py-12">
          <CardContent>
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h3>
            <p className="text-gray-600 mb-6">The user you're looking for doesn't exist or has been removed.</p>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
 <>
      <Navbar/>
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between mt-20">
       
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-100">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-gray-600 mb-3">{user.email}</p>
                
                <Badge className={`${getRoleColor(user.role)} border`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role.replace("_", " ")}
                </Badge>

                {user.role === "STORE_OWNER" && user.rating && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-amber-600">
                        {user.rating}
                      </span>
                      <div className="flex">
                        {renderStars(user.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-amber-700">Store Rating</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                User Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <p className="text-gray-900">{user.address || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">Role</label>
                      <p className="text-gray-900">{user.role.replace("_", " ")}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {user.createdAt && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info for Store Owners */}
      {user.role === "STORE_OWNER" && (
        <Card>
          <CardHeader>
            <CardTitle>Store Owner Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{user.rating || "N/A"}</div>
                <div className="text-sm text-blue-700">Average Rating</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">Active</div>
                <div className="text-sm text-green-700">Store Status</div>
              </div>
              
             
            </div>
          </CardContent>
        </Card>
      )}
    </div>
 </>
  );
};

export default UserProfile;