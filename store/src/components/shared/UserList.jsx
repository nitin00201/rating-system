import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button"; // Adjust import path based on your UI setup

const UserList = ({ users = [] }) => {
  const hasStoreOwner = users.some((user) => user.role === "store_owner");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Role</TableHead>
              {hasStoreOwner && <TableHead>Rating</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role}</TableCell>
                {hasStoreOwner && (
                  <TableCell>
                    {user.role === "store_owner" ? user.rating ?? "N/A" : "—"}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex gap-2">
                    <Link to={`/users/${user.id}`}>
                      <Button variant="outline">View</Button>
                    </Link>
                    {/* <Link to={`/users/${user.id}/edit`}>
                      <Button>Edit</Button>
                    </Link> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserList;
