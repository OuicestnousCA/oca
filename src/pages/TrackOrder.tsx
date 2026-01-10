import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, CircleDot } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const },
  confirmed: { label: "Confirmed", variant: "default" as const },
  processing: { label: "Processing", variant: "default" as const },
  shipped: { label: "Shipped", variant: "default" as const },
  delivered: { label: "Delivered", variant: "default" as const },
  cancelled: { label: "Cancelled", variant: "destructive" as const },
};

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim() || !email.trim()) {
      toast.error("Please enter both order number and email");
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setOrder(null);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber.trim())
        .eq("customer_email", email.trim().toLowerCase())
        .single();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStepIndex = (status: string) => {
    if (status === "cancelled") return -1;
    return statusSteps.findIndex((step) => step.key === status);
  };

  return (
    <>
      <Helmet>
        <title>Track Order | OUICESTNOUS</title>
        <meta name="description" content="Track your order status and delivery progress." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-2 text-center">Track Your Order</h1>
            <p className="text-muted-foreground text-center mb-8">
              Enter your order number and email to check your order status
            </p>

            <form onSubmit={handleSearch} className="space-y-4 mb-12">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
                  Order Number
                </label>
                <Input
                  id="orderNumber"
                  type="text"
                  placeholder="e.g., ORD-1234567890"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </form>

            {notFound && (
              <div className="text-center py-12 border border-border rounded-lg">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-display text-xl mb-2">Order Not Found</h2>
                <p className="text-muted-foreground">
                  We couldn't find an order with that number and email. Please check your details and try again.
                </p>
              </div>
            )}

            {order && (
              <div className="border border-border p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-xl tracking-wide">
                      Order #{order.order_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge 
                    variant={statusConfig[order.status as keyof typeof statusConfig]?.variant || "secondary"}
                    className="w-fit"
                  >
                    {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                  </Badge>
                </div>

                {/* Status Timeline */}
                {order.status !== "cancelled" ? (
                  <div className="py-6">
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                      <div 
                        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                        style={{ 
                          width: `${(getCurrentStepIndex(order.status) / (statusSteps.length - 1)) * 100}%` 
                        }}
                      />

                      {/* Steps */}
                      <div className="relative flex justify-between">
                        {statusSteps.map((step, index) => {
                          const currentIndex = getCurrentStepIndex(order.status);
                          const isCompleted = index <= currentIndex;
                          const isCurrent = index === currentIndex;
                          const StepIcon = step.icon;

                          return (
                            <div key={step.key} className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "bg-background border-border text-muted-foreground"
                                } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                              >
                                {isCurrent ? (
                                  <CircleDot className="w-5 h-5" />
                                ) : (
                                  <StepIcon className="w-5 h-5" />
                                )}
                              </div>
                              <span
                                className={`mt-2 text-xs text-center max-w-[80px] ${
                                  isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <XCircle className="w-12 h-12 mx-auto text-destructive mb-2" />
                    <p className="text-destructive font-medium">This order has been cancelled</p>
                  </div>
                )}

                {/* Order Items */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-display text-lg mb-4">Order Items</h3>
                  <div className="divide-y divide-border">
                    {(order.items as unknown as OrderItem[]).map((item, index) => (
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
                </div>

                {/* Order Summary */}
                <div className="border-t border-border pt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R{Number(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>R{Number(order.shipping_cost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="font-display text-lg">R{Number(order.total).toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="border-t border-border pt-6">
                    <h3 className="font-display text-lg mb-2">Shipping Address</h3>
                    <p className="text-muted-foreground text-sm">
                      {(order.shipping_address as any).address}<br />
                      {(order.shipping_address as any).city}, {(order.shipping_address as any).province} {(order.shipping_address as any).postalCode}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TrackOrder;
