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
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Support Column */}
          <div>
            <h4 className="font-display text-sm tracking-wide uppercase mb-4 text-white">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/shipping-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                Delivery Options
              </Link>
              <Link to="/refund-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                Returns
              </Link>
              <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-display text-sm tracking-wide uppercase mb-4 text-white">Services</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/track-order" className="text-gray-300 hover:text-white transition-colors text-sm">
                Track Your Order
              </Link>
              <Link to="/my-account" className="text-gray-300 hover:text-white transition-colors text-sm">
                My Account
              </Link>
            </nav>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-display text-sm tracking-wide uppercase mb-4 text-white">About Us</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Stay Up to Date Column */}
          <div>
            <h4 className="font-display text-sm tracking-wide uppercase mb-4 text-white">Stay Up To Date</h4>
            <p className="text-gray-300 text-sm mb-4">Sign up and get 15% OFF on your first purchase!</p>
            
            <form onSubmit={handleSubscribe} className="flex gap-0 mb-6">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white text-black border-0 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white border border-white px-5 py-2.5 text-sm font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-50 whitespace-nowrap"
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
                className="text-white hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/ouicestnousca/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@ouicestnousca?is_from_webapp=1&sender_device=pc" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/channel/UC3PiDqi3Ccfqnon_L8y6TTw" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="border border-gray-600 p-2">
                <img src={logo} alt="OUICESTNOUS" className="h-8 w-auto invert" />
              </div>
              <span className="text-xs text-white uppercase tracking-wider">Authentic Streetwear</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left - Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>

            {/* Center - Copyright */}
            <p className="text-gray-400 text-xs">
              ©OUICESTNOUS, {new Date().getFullYear()}. All Rights Reserved
            </p>

            {/* Right - Payment Methods */}
            <div className="flex items-center gap-2">
              {/* Visa */}
              <div className="bg-white rounded px-2 py-1.5 flex items-center justify-center w-10 h-6">
                <svg viewBox="0 0 48 16" className="h-3" fill="none">
                  <path d="M19.5 1.5L17 14.5H13.5L16 1.5H19.5Z" fill="#1A1F71"/>
                  <path d="M31.5 1.8C30.7 1.5 29.5 1.2 28 1.2C24 1.2 21.2 3.3 21.2 6.3C21.2 8.5 23.2 9.7 24.7 10.5C26.3 11.3 26.8 11.8 26.8 12.5C26.8 13.5 25.6 14 24.5 14C23 14 22.2 13.8 20.9 13.2L20.4 13L19.9 16C21 16.4 22.8 16.8 24.7 16.8C29 16.8 31.7 14.7 31.7 11.5C31.7 9.8 30.6 8.5 28.3 7.4C26.9 6.7 26.1 6.2 26.1 5.5C26.1 4.8 26.9 4.2 28.5 4.2C29.8 4.2 30.8 4.4 31.5 4.7L31.9 4.9L32.4 2L31.5 1.8Z" fill="#1A1F71"/>
                  <path d="M37.5 1.5C36.7 1.5 36.1 1.7 35.7 2.5L29.5 14.5H34L34.8 12H40L40.5 14.5H44.5L41 1.5H37.5ZM36 9.2C36.3 8.3 37.8 4.2 37.8 4.2C37.8 4.2 38.2 3.1 38.4 2.4L38.7 4.1C38.7 4.1 39.6 8.3 39.8 9.2H36Z" fill="#1A1F71"/>
                  <path d="M12.5 1.5L8.5 10.5L8 8C7.3 5.7 5.2 3.2 2.8 2L6.5 14.5H11L17 1.5H12.5Z" fill="#1A1F71"/>
                  <path d="M6.5 1.5H0L0 1.8C5 3 8.3 5.8 9.5 9L8.2 2.5C8 1.8 7.4 1.5 6.5 1.5Z" fill="#F9A51A"/>
                </svg>
              </div>
              {/* Mastercard */}
              <div className="bg-[#1A1F36] rounded px-2 py-1.5 flex items-center justify-center w-10 h-6">
                <svg viewBox="0 0 32 20" className="h-4">
                  <circle cx="11" cy="10" r="8" fill="#EB001B"/>
                  <circle cx="21" cy="10" r="8" fill="#F79E1B"/>
                  <path d="M16 4.5C17.8 6 19 8.3 19 10.8C19 13.3 17.8 15.6 16 17.1C14.2 15.6 13 13.3 13 10.8C13 8.3 14.2 6 16 4.5Z" fill="#FF5F00"/>
                </svg>
              </div>
              {/* American Express */}
              <div className="bg-[#006FCF] rounded px-1.5 py-1.5 flex items-center justify-center w-10 h-6">
                <span className="text-white font-bold text-[5px] leading-tight text-center">AMERICAN<br/>EXPRESS</span>
              </div>
              {/* Diners Club */}
              <div className="bg-white rounded px-1.5 py-1.5 flex items-center justify-center w-10 h-6">
                <svg viewBox="0 0 24 24" className="h-4">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#004A97" strokeWidth="1.5"/>
                  <path d="M8 7V17M16 7V17" stroke="#004A97" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
