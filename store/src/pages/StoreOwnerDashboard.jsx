import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import Navbar from '../components/shared/Navbar';
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import axios from "axios";

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState([]);
  const { user, token } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.role !== "STORE_OWNER") {
      navigate("/unauthorised");
    }
  }, [user, navigate]);

  if (!user || user?.role !== "STORE_OWNER") return null;

  useEffect(() => {
    const fetchStoreAndRatings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/store-owner/stores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const stores = response.data;

        const enrichedStores = stores.map((store) => {
          const ratings = store.ratings.map(r => ({
            id: r.id,
            user: r.user.name,
            email: r.user.email,
            rating: r.rating,
            date: new Date(r.createdAt).toLocaleDateString(),
          }));

          const avgRating =
            ratings.length > 0
              ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
              : "N/A";

          return {
            ...store,
            ratings,
            avgRating,
          };
        });

        setStoreData(enrichedStores);
      } catch (err) {
        console.error('Error fetching store data:', err);
      }
    };

    if (token) {
      fetchStoreAndRatings();
    }
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Store Owner Dashboard</h1>
            <Button variant="outline" onClick={() => alert("Logging out...")}>
              Logout
            </Button>
          </div>

          {/* Store Cards */}
          {storeData.length === 0 ? (
            <p className="text-center text-gray-500">No stores found.</p>
          ) : (
            storeData.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle>{store.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">{store.email}</p>
                    <p className="text-sm text-gray-500">{store.address}</p>
                    <p className="text-lg font-bold mt-2 text-yellow-600">
                      ⭐ Average Rating: {store.avgRating}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">User Ratings</h4>
                    {store.ratings.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {store.ratings.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell>{r.user}</TableCell>
                              <TableCell>{r.email}</TableCell>
                              <TableCell>⭐ {r.rating}</TableCell>
                              <TableCell>{r.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-gray-500">No ratings yet for this store.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default StoreOwnerDashboard;
