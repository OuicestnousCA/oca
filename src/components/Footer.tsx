import { Instagram, Facebook, Youtube } from "lucide-react";
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
    <footer className="bg-white text-black">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Support Column */}
          <div>
            <h4 className="font-display text-sm tracking-wide uppercase mb-4 text-black font-semibold">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/contact" className="text-gray-700 hover:text-black transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/shipping-policy" className="text-gray-700 hover:text-black transition-colors text-sm">
                Delivery Options
              </Link>
              <Link to="/refund-policy" className="text-gray-700 hover:text-black transition-colors text-sm">
                Returns
              </Link>
              <Link to="/privacy-policy" className="text-gray-700 hover:text-black transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-700 hover:text-black transition-colors text-sm">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-display text-sm tracking-wide uppercase mb-4 text-black font-semibold">Services</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/track-order" className="text-gray-700 hover:text-black transition-colors text-sm">
                Track Your Order
              </Link>
              <Link to="/my-account" className="text-gray-700 hover:text-black transition-colors text-sm">
                My Account
              </Link>
            </nav>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-display text-sm tracking-wide uppercase mb-4 text-black font-semibold">About Us</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-gray-700 hover:text-black transition-colors text-sm">
                Home
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-black transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Stay Up to Date Column */}
          <div>
            <h4 className="font-display text-sm tracking-wide uppercase mb-4 text-black font-semibold">Stay Up To Date</h4>
            <p className="text-gray-700 text-sm mb-4">Sign up and get 15% OFF on your first purchase!</p>
            
            <form onSubmit={handleSubscribe} className="flex gap-0 mb-6">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-gray-100 text-black border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "..." : "SIGN UP"}
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-6">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/ouicestnousca/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@ouicestnousca?is_from_webapp=1&sender_device=pc" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="border border-gray-300 p-2">
                <img src={logo} alt="OUICESTNOUS" className="h-8 w-auto" />
              </div>
              <span className="text-xs text-black uppercase tracking-wider">Authentic Streetwear</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left - Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link to="/terms" className="text-gray-700 hover:text-black transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy-policy" className="text-gray-700 hover:text-black transition-colors">
                Privacy Policy
              </Link>
            </div>

            {/* Center - Copyright */}
            <p className="text-gray-600 text-xs">
              ©OUICESTNOUS, {new Date().getFullYear()}. All Rights Reserved
            </p>

            {/* Right - Payment Methods */}
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded px-2 py-1 border border-gray-300">
                <span className="text-blue-800 font-bold text-xs">VISA</span>
              </div>
              <div className="bg-gray-100 rounded px-2 py-1 border border-gray-300">
                <span className="text-orange-500 font-bold text-xs">MC</span>
              </div>
              <div className="bg-gray-100 rounded px-2 py-1 border border-gray-300">
                <span className="text-blue-600 font-bold text-[8px]">AMEX</span>
              </div>
              <div className="bg-gray-100 rounded px-2 py-1 border border-gray-300">
                <span className="text-blue-700 font-bold text-[8px]">DINERS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
