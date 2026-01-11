import { Instagram, Truck, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim() },
      });

      if (error) throw error;

      if (data.alreadySubscribed) {
        toast.info("You're already subscribed to our newsletter!");
      } else {
        toast.success("Successfully subscribed to our newsletter!");
      }
      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-secondary">
      {/* Features Bar */}
      <div className="border-b border-border">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* 7 Days Return */}
            <div className="flex items-start gap-4">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-display text-sm tracking-wide uppercase mb-1">7 Days Return</h4>
                <p className="text-xs text-muted-foreground">
                  For Local and national purchases only.<br />
                  For international purchases, kindly<br />
                  <Link to="/contact" className="underline hover:text-foreground">Contact us</Link>
                </p>
              </div>
            </div>

            {/* Free Shipping */}
            <div className="flex items-start gap-4">
              <Truck className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-display text-sm tracking-wide uppercase mb-1">Free Shipping</h4>
                <p className="text-xs text-muted-foreground">
                  Local and national orders over R500.
                </p>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-display text-sm tracking-wide uppercase mb-3">Newsletter Sign Up</h4>
              <form onSubmit={handleSubscribe} className="flex gap-0">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email please"
                  className="flex-1 bg-background border border-border border-r-0 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-foreground text-background px-6 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "..." : "SUBSCRIBE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link to="/">
              <img src={logo} alt="OUICESTNOUS" className="h-6 w-auto dark:invert-0 invert" />
            </Link>
            <p className="mt-4 text-muted-foreground text-sm max-w-xs">
              Authentic streetwear from South Africa. Express yourself through fashion.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg tracking-wide mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Home
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Contact
              </Link>
              <Link to="/my-account" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                My Account
              </Link>
              <Link to="/track-order" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Track Order
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Terms and Conditions
              </Link>
              <Link to="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Refund and Returns Policy
              </Link>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/shipping-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Shipping Policy
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg tracking-wide mb-4">Stay Connected</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/ouicestnousca/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@ouicestnousca?is_from_webapp=1&sender_device=pc" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} OUICESTNOUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
