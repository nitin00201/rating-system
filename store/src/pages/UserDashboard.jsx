import { useEffect, useState } from "react"
import Navbar from "../components/shared/Navbar"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardTitle, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"

const UserDashboard = () => {
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState({ name: "", address: "" })
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    // Replace with real API data
    setStores([
      { id: 1, name: "TechMart", address: "New York", rating: 4.5 },
      { id: 2, name: "Gadget Zone", address: "Los Angeles", rating: 4.0 },
    ])
  }, [])

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      store.address.toLowerCase().includes(filters.address.toLowerCase())
  )

  const handleRatingChange = (storeId, value) => {
    setRatings({ ...ratings, [storeId]: value })
  }

  const handleSubmitRating = (storeId) => {
    const rating = ratings[storeId]
    if (rating >= 1 && rating <= 5) {
      // Submit to API
      alert(`Rating submitted: ${rating}`)
    } else {
      alert("Rating must be between 1 and 5")
    }
  }

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Stores</h1>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input
            placeholder="Search by Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <Input
            placeholder="Search by Address"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          />
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id}>
              <CardHeader>
                <CardTitle>{store.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Address:</strong> {store.address}</p>
                <p><strong>Overall Rating:</strong> {store.rating}</p>

                <Input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Your Rating (1-5)"
                  value={ratings[store.id] || ""}
                  onChange={(e) => handleRatingChange(store.id, e.target.value)}
                />
                <Button onClick={() => handleSubmitRating(store.id)} size="sm">
                  Submit Rating
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default UserDashboard
