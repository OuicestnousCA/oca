import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Package, 
  Settings, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  LogOut,
  Mail,
  Bell
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  confirmed: { label: "Confirmed", icon: CheckCircle, variant: "default" as const },
  processing: { label: "Processing", icon: Package, variant: "default" as const },
  shipped: { label: "Shipped", icon: Truck, variant: "default" as const },
  delivered: { label: "Delivered", icon: CheckCircle, variant: "default" as const },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
};

const MyAccount = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString("en-ZA", { year: "numeric", month: "long" })
    : "";

  return (
    <>
      <Helmet>
        <title>My Account | OUICESTNOUS</title>
        <meta name="description" content="Manage your account, view order history, and update your settings." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 container py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl tracking-wide">My Account</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {userName}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="w-fit">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="border border-border p-6 space-y-6">
                <h2 className="font-display text-xl tracking-wide">Profile Information</h2>
                
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={userName} disabled className="bg-muted" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Input id="email" defaultValue={userEmail} disabled className="bg-muted" />
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Member since {memberSince}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-border p-6 space-y-4">
                <h2 className="font-display text-xl tracking-wide">Account Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-secondary text-center">
                    <p className="font-display text-2xl">{orders?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="p-4 bg-secondary text-center">
                    <p className="font-display text-2xl">
                      {orders?.filter(o => o.status === "delivered").length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                  </div>
                  <div className="p-4 bg-secondary text-center">
                    <p className="font-display text-2xl">
                      {orders?.filter(o => ["pending", "confirmed", "processing", "shipped"].includes(o.status)).length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <h2 className="font-display text-xl tracking-wide">Order History</h2>
              
              {ordersLoading ? (
                <div className="animate-pulse text-muted-foreground">Loading orders...</div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig];
                    const StatusIcon = status?.icon || Clock;
                    const items = order.items as unknown as OrderItem[];

                    return (
                      <div key={order.id} className="border border-border p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="font-display text-lg tracking-wide">
                              Order #{order.order_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString("en-ZA", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <Badge variant={status?.variant || "secondary"} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="w-3 h-3" />
                            {status?.label || order.status}
                          </Badge>
                        </div>

                        <div className="divide-y divide-border">
                          {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Size: {item.size} · Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-medium">R{item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-display text-lg">R{Number(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 border border-border">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-display text-xl mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">
                    When you make a purchase, your orders will appear here.
                  </p>
                  <a href="/" className="btn-primary px-8 py-3 inline-block">
                    Start Shopping
                  </a>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="border border-border p-6 space-y-6">
                <h2 className="font-display text-xl tracking-wide">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional emails and newsletters
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="order-updates" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Order Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about order status changes
                      </p>
                    </div>
                    <Switch
                      id="order-updates"
                      checked={orderUpdates}
                      onCheckedChange={setOrderUpdates}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-border p-6 space-y-4">
                <h2 className="font-display text-xl tracking-wide">Account Security</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your password and account security settings.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/reset-password")}
                >
                  Change Password
                </Button>
              </div>

              <div className="border border-destructive/20 p-6 space-y-4">
                <h2 className="font-display text-xl tracking-wide text-destructive">Danger Zone</h2>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" disabled>
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground">
                  Contact support to delete your account.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MyAccount;
