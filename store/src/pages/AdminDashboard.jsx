import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import ActionComponent from '../components/shared/ActionComponent'
import UserList from "../components/shared/UserList";
import StoreList from "../components/shared/StoreList";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import Navbar from "../components/shared/Navbar";
import axios from "axios";
import useUserListStore from "../store/userListStore";
import useStoreStore from "../store/useStore";

const AdminDashboard = () => {
  const { users, fetchUsers, loading, error } = useUserListStore();
  const { stores, fetchStores } = useStoreStore();
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sortRatingOrder, setSortRatingOrder] = useState("asc"); // or "desc"
  const [dbstarts, setDbStarts] = useState({
    user: 0,
    store: 0,
    reviews: 0
  })
  const { user, token } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.role !== "SYSTEM_ADMINISTRATOR") {
      navigate("/unauthorised"); // or "/signin"
    }
  }, [user, navigate]);

  if (!user || user?.role !== "SYSTEM_ADMINISTRATOR") return null;

  useEffect(() => {
    if (token) {
      fetchUsers(); // Zustand handles the API call
    }
  }, [token, fetchUsers]);
  

  useEffect(() => {
    if (!token) return;


    fetchStores();
  }, [])

  useEffect(() => {
    const dashboardStats = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { totalUsers, totalStores, totalRatings } = res.data;

        setDbStarts({
          user: totalUsers,
          store: totalStores,
          reviews: totalRatings,
        });

        console.log("Dashboard stats", res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    if (token) {
      dashboardStats();
    }
  }, [token]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      u.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      u.role.toLowerCase().includes(filters.role.toLowerCase())
  );
  const filteredStores = stores
    .filter(
      (s) =>
        s.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        s.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        s.address.toLowerCase().includes(filters.address.toLowerCase())
    )
    .sort((a, b) => {
      return sortRatingOrder === "asc"
        ? a.averageRating - b.averageRating
        : b.averageRating - a.averageRating;
    });

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6 mt-16">
        <h1 className="text-3xl font-bold ">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{dbstarts.user}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Stores</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{dbstarts.store}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Ratings</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{dbstarts.reviews}</CardContent>
          </Card>
        </div>
        <ActionComponent />


        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {["name", "email", "address", "role"].map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="capitalize">
                {field}
              </Label>
              <Input
                id={field}
                placeholder={`Filter by ${field}`}
                value={filters[field]}
                onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Label>Sort by Rating:</Label>
          <Button
            variant={sortRatingOrder === "asc" ? "default" : "outline"}
            onClick={() => setSortRatingOrder("asc")}
          >
            Ascending
          </Button>
          <Button
            variant={sortRatingOrder === "desc" ? "default" : "outline"}
            onClick={() => setSortRatingOrder("desc")}
          >
            Descending
          </Button>
        </div>
        <UserList users={filteredUsers} />
        <StoreList stores={filteredStores} />
      </div>
    </>
  );
};

export default AdminDashboard;
