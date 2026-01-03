import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Package, DollarSign, ShoppingCart, TrendingUp, Loader2, ShieldAlert, Users, Search, UserPlus, UserMinus, BarChart3, Download, FileText, Boxes } from "lucide-react";
import { format } from "date-fns";
import SalesAnalytics from "@/components/admin/SalesAnalytics";
import InventoryManagement from "@/components/admin/InventoryManagement";
import { exportOrdersToCSV, exportAnalyticsToPDF } from "@/utils/exportUtils";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: any[];
}

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  
  // User management state
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUserEmail, setSearchedUserEmail] = useState<string | null>(null);
  const [searchedUserId, setSearchedUserId] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchUserRoles();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } else {
      const ordersData = (data || []) as Order[];
      setOrders(ordersData);
      calculateStats(ordersData);
    }
    setLoading(false);
  };

  const fetchUserRoles = async () => {
    setUsersLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user roles:", error);
      toast.error("Failed to load user roles");
    } else {
      setUserRoles((data || []) as UserRole[]);
    }
    setUsersLoading(false);
  };

  const searchUserByEmail = async () => {
    if (!searchEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    setSearchLoading(true);
    setSearchedUserEmail(null);
    setSearchedUserId(null);
    
    // Search for orders by this email to find the user
    const { data: orderData } = await supabase
      .from("orders")
      .select("user_id, customer_email")
      .eq("customer_email", searchEmail.trim())
      .limit(1);

    if (orderData && orderData.length > 0 && orderData[0].user_id) {
      setSearchedUserEmail(searchEmail.trim());
      setSearchedUserId(orderData[0].user_id);
    } else {
      toast.error("No user found with this email. Users need to have placed an order to be promoted.");
    }
    setSearchLoading(false);
  };

  const promoteToAdmin = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" as any });

    if (error) {
      if (error.code === "23505") {
        toast.error("User already has this role");
      } else {
        console.error("Error promoting user:", error);
        toast.error("Failed to promote user");
      }
    } else {
      toast.success("User promoted to admin");
      fetchUserRoles();
      setSearchEmail("");
      setSearchedUserEmail(null);
      setSearchedUserId(null);
    }
  };

  const removeRole = async (roleId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", roleId);

    if (error) {
      console.error("Error removing role:", error);
      toast.error("Failed to remove role");
    } else {
      toast.success("Role removed");
      fetchUserRoles();
    }
  };

  const calculateStats = (ordersData: Order[]) => {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData
      .filter((o) => o.payment_status === "paid")
      .reduce((sum, o) => sum + Number(o.total), 0);
    const pendingOrders = ordersData.filter((o) => o.status === "pending" || o.status === "processing").length;
    const completedOrders = ordersData.filter((o) => o.status === "delivered").length;

    setStats({ totalOrders, totalRevenue, pendingOrders, completedOrders });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus as any })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } else {
      toast.success("Order status updated");
      fetchOrders();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <ShieldAlert className="h-16 w-16 mx-auto text-destructive" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Manage Orders</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportOrdersToCSV(orders);
                  toast.success("Orders exported to CSV");
                }}
                disabled={orders.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportAnalyticsToPDF(orders);
                  toast.success("Analytics report opened for printing");
                }}
                disabled={orders.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedOrders}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="inventory">
                <Boxes className="h-4 w-4 mr-2" />
                Inventory
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>

                {["all", "pending", "processing", "shipped", "delivered"].map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {tab === "all" ? "All Orders" : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Orders`}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Order #</TableHead>
                                  <TableHead>Customer</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Items</TableHead>
                                  <TableHead>Total</TableHead>
                                  <TableHead>Payment</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {orders
                                  .filter((order) => tab === "all" || order.status === tab)
                                  .map((order) => (
                                    <TableRow key={order.id}>
                                      <TableCell className="font-medium">{order.order_number}</TableCell>
                                      <TableCell>
                                        <div>
                                          <p className="font-medium">{order.customer_name}</p>
                                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                                        </div>
                                      </TableCell>
                                      <TableCell>{format(new Date(order.created_at), "MMM d, yyyy")}</TableCell>
                                      <TableCell>{order.items?.length || 0} items</TableCell>
                                      <TableCell>₦{Number(order.total).toLocaleString()}</TableCell>
                                      <TableCell>
                                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                                          {order.payment_status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Select
                                          value={order.status}
                                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                                        >
                                          <SelectTrigger className="w-[130px]">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                {orders.filter((order) => tab === "all" || order.status === tab).length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                      No orders found
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <SalesAnalytics orders={orders} />
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users">
              <div className="space-y-6">
                {/* Add Admin Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Promote User to Admin
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">User Email</label>
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            placeholder="Enter user email address"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchUserByEmail()}
                          />
                          <Button onClick={searchUserByEmail} disabled={searchLoading}>
                            {searchLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {searchedUserEmail && searchedUserId && (
                      <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{searchedUserEmail}</p>
                            <p className="text-sm text-muted-foreground">User ID: {searchedUserId.slice(0, 8)}...</p>
                          </div>
                          <Button onClick={() => promoteToAdmin(searchedUserId)} size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Promote to Admin
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Current Admins Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Current Admin Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : userRoles.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        No admin users found. Use the form above to promote users.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userRoles.map((role) => (
                            <TableRow key={role.id}>
                              <TableCell className="font-mono text-sm">
                                {role.user_id}
                              </TableCell>
                              <TableCell>
                                <Badge variant={role.role === "admin" ? "default" : "secondary"}>
                                  {role.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {format(new Date(role.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeRole(role.id)}
                                  disabled={role.user_id === user?.id}
                                >
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <InventoryManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Admin;
