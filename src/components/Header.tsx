import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, User, Search, ShoppingBag, Heart, Menu, X, LogOut, Package, Shield } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { totalItems: wishlistItems, openWishlist } = useWishlist();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
          <img src={logo} alt="OUICESTNOUS" className="h-6 md:h-8 w-auto dark:invert-0 invert" />
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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="icon-btn" aria-label="Account">
                  <User className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium truncate">
                  {user.user_metadata?.full_name || user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="icon-btn" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
          )}

          <button className="icon-btn relative" aria-label="Wishlist" onClick={openWishlist}>
            <Heart className="w-5 h-5" />
            {wishlistItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                {wishlistItems}
              </span>
            )}
          </button>
          <button className="icon-btn relative" aria-label="Cart" onClick={openCart}>
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
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
            {user && (
              <>
                <Link to="/orders" className="nav-link py-2">My Orders</Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link py-2">Admin Dashboard</Link>
                )}
              </>
            )}
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
