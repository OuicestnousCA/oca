import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, User, Search, ShoppingBag, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Social bar */}
      <div className="hidden md:flex justify-end py-2 px-4 border-b border-border">
        <div className="flex items-center gap-3">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label="TikTok"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="OUICESTNOUS" className="h-6 md:h-8 w-auto invert" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="nav-link nav-link-active">Home</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <button className="icon-btn hidden md:flex" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button className="icon-btn" aria-label="Account">
            <User className="w-5 h-5" />
          </button>
          <button className="icon-btn relative" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
              0
            </span>
          </button>
          <button 
            className="icon-btn md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border animate-slide-down">
          <div className="container py-6 flex flex-col gap-4">
            <Link to="/" className="nav-link py-2">Home</Link>
            <Link to="/contact" className="nav-link py-2">Contact</Link>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="icon-btn"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="icon-btn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
