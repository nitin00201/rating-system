import { useEffect, useState } from "react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import axios from "axios"
import useUserStore from "../../store/userStore"
import { toast } from "sonner"
import useUserListStore from "../../store/userListStore"
import useStoreStore from "../../store/useStore"

const ActionComponent = () => {
  const [activeAction, setActiveAction] = useState(null)
  const { storeOwners, fetchStoreOwners } = useUserListStore();
  const { users, fetchUsers, loading, error } = useUserListStore();
  const { createStore } = useStoreStore();



  const {token} = useUserStore();

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  })

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  })
  useEffect(() => {
    fetchStoreOwners();
  }, []);

  const handleOpenDrawer = (action) => {
    setActiveAction(action)
    document.getElementById("drawer-trigger")?.click()
  }

  const handleUserChange = (e) => {
    const { id, value } = e.target
    setUserForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleStoreChange = (e) => {
    const { id, value } = e.target
    setStoreForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleUserSubmit = async(e) => {
    e.preventDefault()
    console.log("User Form Submitted:", userForm)
    try {
      const response  = await axios.post('http://localhost:4000/api/admin/users/', userForm,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log("response",response);
      console.log('user created',response.data);
      fetchUsers();
      toast.success("User Created Successfully", {
        position:"top-center",
        duration:5000,  
       })
      setUserForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "",
      })    
    } catch (error) {
      console.log(error);
      toast.error("Something error occured", {
        position:"top-center",
        duration:5000,  
       })
       setUserForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "",
      })    
      
    }
    
  }

  const handleStoreSubmit = async (e) => {
    e.preventDefault()
    console.log("Store Form Submitted:", storeForm)

    try {
      const response = await axios.post('http://localhost:4000/api/admin/stores/',
        {
            "name": storeForm.name,
            "email": storeForm.email,
            "address": storeForm.address,
            "ownerId": parseInt(storeForm.ownerId) 
        },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log("response",response);
      toast.success("Store Created Successfully", {
        position:"top-center",
        duration:5000,  
       })
      console.log('store created',response.data);
      setStoreForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      })
      
    }catch(error){
      console.log(error);
      toast.error("Something error occured", {
        position:"top-center",
        duration:5000,
       })
       setStoreForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      })
    }
  }

  const renderDrawerContent = () => {
    switch (activeAction) {
      case "create-user":
        return (
          <form className="space-y-4" onSubmit={handleUserSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter user name" value={userForm.name} onChange={handleUserChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter user email" value={userForm.email} onChange={handleUserChange} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password"   minLength={8} placeholder="Create password" value={userForm.password} onChange={handleUserChange} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" type="text" placeholder="Enter User Address" value={userForm.address} onChange={handleUserChange} />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setUserForm((prev) => ({ ...prev, role: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL_USER">Normal User</SelectItem>
                  <SelectItem value="SYSTEM_ADMINISTRATOR">Admin</SelectItem>
                  <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="frms" type="submit">Create User</Button>
          </form>
        )

        case "create-store":
          return (
            <form className="space-y-4" onSubmit={handleStoreSubmit}>
              <div>
                <Label htmlFor="name">Store Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Enter store name" 
                  value={storeForm.name} 
                  onChange={handleStoreChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="email">Store Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="Enter store email" 
                  value={storeForm.email} 
                  onChange={handleStoreChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="address">Store Address</Label>
                <Input 
                  id="address" 
                  name="address"
                  placeholder="Enter store address" 
                  value={storeForm.address} 
                  onChange={handleStoreChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="ownerId">Store Owner</Label>
                <Select
                  value={storeForm.ownerId?.toString() || ""}
                  onValueChange={(value) => {
                    setStoreForm(prev => ({
                      ...prev,
                      ownerId: parseInt(value)
                    }));
                  }}
                >
                  <SelectTrigger id="ownerId" >
                    <SelectValue placeholder="Select store owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeOwners.map(owner => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button size="frms" type="submit">
                Submit Store
              </Button>
            </form>
          )
      // case "demo":
      //   return (
      //     <div>
      //       <p>This is just a demo action. You can put anything here.</p>
      //       <Button onClick={() => console.log("Demo clicked!")}>Run Demo</Button>
      //     </div>
      //   )

      default:
        return <p>Select an action to begin.</p>
    }
  }

  return (
    <div className="space-x-4 flex justify-end gap-8">
      {/* Trigger Buttons */}
      <Button onClick={() => handleOpenDrawer("create-user")}>Create User</Button>
      <Button onClick={() => handleOpenDrawer("create-store")}>Create Store</Button>
      {/* <Button onClick={() => handleOpenDrawer("demo")}>Demo</Button> */}

      <Drawer>
        <DrawerTrigger asChild>
          <Button id="drawer-trigger" className="hidden">Open</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {activeAction === "create-user" && "Create User"}
              {activeAction === "create-store" && "Create Store"}
              {activeAction === "demo" && "Demo Action"}
            </DrawerTitle>
            <DrawerDescription>
              {activeAction === "create-user" && "Fill in the form to create a new user."}
              {activeAction === "create-store" && "Enter the details for a new store."}
              {activeAction === "demo" && "Try out a demo drawer action."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-4">
            {renderDrawerContent()}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ActionComponent
