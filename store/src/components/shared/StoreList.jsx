import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "../ui/card"
  import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "../ui/table"
  
  const StoreList = ({ stores = [] }) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Stores</CardTitle>
        </CardHeader>
  
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="4" className="text-center text-muted-foreground">
                    No stores available.
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{store.email}</TableCell>
                    <TableCell>{store.address}</TableCell>
                    <TableCell>{parseFloat(store.averageRating)?.toFixed(1) || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };
  
  export default StoreList;
  