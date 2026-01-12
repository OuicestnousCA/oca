import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("newsletter-popup-shown");
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletter-popup-shown", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Welcome!",
        description: "You've been subscribed successfully. Enjoy 15% off!",
      });
      
      setEmail("");
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-black border-white/20 text-white p-0 overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 text-white/70 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="p-8 text-center flex flex-col items-center">
          {/* Brand Logo */}
          <div className="mb-6">
            <img src={logo} alt="OUICESTNOUS" className="h-12 w-auto invert" />
          </div>
          
          <DialogHeader className="mb-6 w-full flex flex-col items-center">
            <DialogTitle className="text-2xl font-display uppercase tracking-wider text-white text-center">
              Get 15% Off
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-300 mb-2 text-sm">
            Join the OUICESTNOUS family
          </p>
          <p className="text-gray-400 mb-6 text-xs">
            Sign up for exclusive access to new drops, special offers, and street culture updates.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-200 font-display uppercase tracking-wider"
            >
              {isLoading ? "Subscribing..." : "Subscribe & Get 15% Off"}
            </Button>
          </form>
          
          <p className="text-gray-500 text-xs mt-4">
            By subscribing, you agree to our Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;
