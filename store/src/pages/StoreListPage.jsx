import React, { useEffect, useState } from 'react';
import { Search, Star, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Navbar from '../components/shared/Navbar';
import axios from 'axios';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StoresPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]);
  const { token, user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.role !== 'NORMAL_USER') {
      navigate('/unauthorised');
    }
  }, [user, navigate]);

  if (!user || user?.role !== 'NORMAL_USER') return null;

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/user/stores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(res.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStores();
    }
  }, [token]);

  const clearRating = async(storeId)=>{
    const response = await axios.delete(`http://localhost:4000/api/user/ratings/${storeId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log("response",response);
    console.log('rating cleared',response.data);
    toast.success("Rating Cleared Successfully", {
      position:"top-center",
      duration:5000,  
     })
    fetchStores();
  }

  const handleRating = async (storeId, ratingValue) => {
    console.log(`➡️ Submitting rating...`);
    console.log(`Store ID: ${storeId}, Rating Value: ${ratingValue}`);
  
    try {
      setStores(prev =>
        prev.map(store =>
          store.id === storeId ? { ...store, userRating: ratingValue } : store
        )
      );
      console.log('📝 Optimistically updated UI');
  
      const postResponse = await axios.post(
        'http://localhost:4000/api/user/ratings',
        { storeId, ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Rating submitted successfully:', postResponse.data);
  
      fetchStores();
      toast.success("Rating submitted successfully", {
        position:"top-center",
        duration:5000,  
       })
    } catch (error) {
      console.warn('⚠️ Initial rating submission failed:', error.response?.data || error.message);
  
      if (
        error.response?.status === 400 &&
        error.response.data.message?.includes('already')
      ) {
        console.log('🔁 Attempting to update existing rating...');
  
        try {
          const putResponse = await axios.put(
            'http://localhost:4000/api/user/ratings/:id',
            { storeId, ratingValue },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('✅ Rating updated successfully:', putResponse.data);
          toast.success("Rating Updated Successfully", {
            position:"top-center",
            duration:5000,  
           })
  
          fetchStores();
        } catch (updateError) {
          console.error('❌ Error updating rating:', updateError.response?.data || updateError.message);
        }
      } else {
        console.error('❌ Unhandled error during rating process:', error.response?.data || error.message);
        toast.error("Something Error happened", {
          position:"top-center",
          duration:5000,  
         })
      }
    }
  };
  

  const renderStars = (rating, interactive = false, onRate = null, storeId = null) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive ? () => onRate(storeId, star) : undefined}
        />
      ))}
    </div>
  );

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <Card key={store.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {store.address}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Average Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderStars(store.averageRating)}
                    <span className="text-sm font-medium">{store.averageRating}</span>
                  </div>
                </div>

                {/* User Rating */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Rating:</span>
                    <Badge variant="outline" className="text-xs">
                      {store.userRating || 'Not Rated'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    {renderStars(store.userRating || 0, true, handleRating, store.id)}
                    {store.userRating ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearRating(store.id)}
                        className="text-xs"
                      >
                        Clear
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-500">Click to rate</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try adjusting your search terms to find what you're looking for.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoresPage;
