import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary py-16">
      <div className="container">
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
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Shipping Info
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Returns
              </a>
            </nav>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="font-display text-lg tracking-wide mb-4">Stay Connected</h4>
            <div className="flex items-center gap-3 mb-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com" 
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
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              <button className="btn-primary px-6">
                Subscribe
              </button>
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
