import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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

const Orders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders | OUICESTNOUS</title>
        <meta name="description" content="View your order history and track deliveries." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 container py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="font-display text-3xl md:text-4xl tracking-wide">My Orders</h1>
            <Link 
              to="/track-order" 
              className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Track an order with order number
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status?.icon || Clock;
                const items = order.items as unknown as OrderItem[];
                const isExpanded = expandedOrder === order.id;

                return (
                  <div key={order.id} className="border border-border overflow-hidden">
                    {/* Order Header - Always Visible */}
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="w-full p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-display text-lg tracking-wide">
                            Order #{order.order_number}
                          </p>
                          <Badge variant={status?.variant || "secondary"} className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {status?.label || order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })} · {items.length} item{items.length !== 1 ? "s" : ""} · R{Number(order.total).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <OrderStatusTimeline status={order.status} compact />
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-border p-6 space-y-6 bg-muted/20">
                        {/* Full Timeline */}
                        <OrderStatusTimeline status={order.status} />

                        {/* Order Items */}
                        <div className="divide-y divide-border bg-background p-4 border border-border">
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

                        {/* Order Summary */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            {order.shipping_address && (
                              <>
                                <p className="font-medium text-foreground mb-1">Shipping to:</p>
                                <p>{(order.shipping_address as any).address}</p>
                                <p>{(order.shipping_address as any).city}, {(order.shipping_address as any).province}</p>
                              </>
                            )}
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex justify-between sm:justify-end gap-8 text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>R{Number(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between sm:justify-end gap-8 text-sm">
                              <span className="text-muted-foreground">Shipping</span>
                              <span>R{Number(order.shipping_cost).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between sm:justify-end gap-8 font-medium pt-2 border-t border-border">
                              <span>Total</span>
                              <span className="font-display text-lg">R{Number(order.total).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-display text-xl mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                When you make a purchase, your orders will appear here.
              </p>
              <a href="/" className="btn-primary px-8 py-3 inline-block">
                Start Shopping
              </a>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Orders;
