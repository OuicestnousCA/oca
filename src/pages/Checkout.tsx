import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const formatPrice = (amount: number) => {
    return `R${amount.toFixed(2).replace(".", ",")}`;
  };

  // Check for payment callback
  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      verifyPayment(reference);
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-verify", {
        body: { reference },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.data?.status === "success") {
        setOrderComplete(true);
        clearCart();
        toast({
          title: "Payment successful!",
          description: "Your order has been placed. Check your email for confirmation.",
        });
      } else {
        toast({
          title: "Payment verification failed",
          description: data.data?.gateway_response || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast({
        title: "Error verifying payment",
        description: "Please contact support if payment was deducted.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("paystack-initialize", {
        body: {
          email: formData.email,
          amount: totalPrice,
          callback_url: window.location.href,
          metadata: {
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            phone: formData.phone,
            shipping_address: {
              address: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
            },
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
            })),
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast({
        title: "Error initializing payment",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <>
        <Helmet>
          <title>Verifying Payment | OUICESTNOUS</title>
        </Helmet>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <h1 className="font-display text-2xl tracking-wider mb-2">
            Verifying Payment
          </h1>
          <p className="text-muted-foreground">Please wait...</p>
          <ThemeToggle />
        </div>
      </>
    );
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <>
        <Helmet>
          <title>Checkout | OUICESTNOUS</title>
        </Helmet>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="font-display text-3xl tracking-wider mb-4">
            Your cart is empty
          </h1>
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
          <ThemeToggle />
        </div>
      </>
    );
  }

  if (orderComplete) {
    return (
      <>
        <Helmet>
          <title>Order Complete | OUICESTNOUS</title>
        </Helmet>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="font-display text-3xl tracking-wider mb-2">
            Thank You!
          </h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Your order has been placed successfully. Check your email for
            confirmation details.
          </p>
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
          <ThemeToggle />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | OUICESTNOUS</title>
        <meta name="description" content="Complete your order at OUICESTNOUS." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container py-4 flex items-center justify-between">
            <Link to="/">
              <img
                src={logo}
                alt="OUICESTNOUS"
                className="h-6 w-auto dark:invert-0 invert"
              />
            </Link>
            <span className="text-sm text-muted-foreground">Secure Checkout</span>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div>
              <h1 className="font-display text-3xl tracking-wider mb-8">
                Checkout
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-display text-lg tracking-wide mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-lg tracking-wide mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                        />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting to Paystack...
                    </>
                  ) : (
                    `Pay with Paystack - ${formatPrice(totalPrice)}`
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-secondary p-6 sticky top-8">
                <h2 className="font-display text-lg tracking-wide mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover bg-background"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-xs flex items-center justify-center font-medium">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display text-sm tracking-wide">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-border mt-2">
                    <span className="font-display tracking-wide">Total</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <ThemeToggle />
      </div>
    </>
  );
};

export default Checkout;
