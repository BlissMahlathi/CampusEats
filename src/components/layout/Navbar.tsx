import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Menu, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ThemeToggle } from "../theme/ThemeToggle";

const Navbar = () => {
  const { user } = useAuth();
  const { items } = useCart();
  const cartItemCount = items.length;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <UtensilsCrossed className="w-7 h-7 text-primary-500 transition-transform group-hover:rotate-12" />
          <span className="text-xl font-extrabold text-primary-500 tracking-tight">
            CampusEats
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" />
          <NavLink to="/market" label="Market" />
          {!user && <NavLink to="/vendor/register" label="Become a Vendor" />}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/cart">
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full border-primary-200"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center border-2 border-white shadow">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <Button
                variant="default"
                asChild
                className="rounded-full font-semibold px-5"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button
                variant="default"
                asChild
                className="rounded-full font-semibold px-5"
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-3 md:hidden">
          <ThemeToggle />
          <Link to="/cart">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-primary-200"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center border-2 border-white shadow">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pt-8">
              <div className="flex flex-col space-y-6 mt-10">
                <NavLink to="/" label="Home" mobile />
                <NavLink to="/market" label="Market" mobile />
                {!user && (
                  <NavLink
                    to="/vendor/register"
                    label="Become a Vendor"
                    mobile
                  />
                )}
                {user ? (
                  <Button
                    variant="default"
                    asChild
                    className="rounded-full font-semibold px-5"
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    asChild
                    className="rounded-full font-semibold px-5"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

// Animated underline NavLink helper
const NavLink = ({
  to,
  label,
  mobile = false,
}: {
  to: string;
  label: string;
  mobile?: boolean;
}) => (
  <Link
    to={to}
    className={`${
      mobile
        ? "text-lg font-medium"
        : "relative text-sm font-medium transition-colors"
    } hover:text-primary-500`}
  >
    <span className="relative">
      {label}
      {!mobile && (
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full group-focus:w-full" />
      )}
    </span>
  </Link>
);

export default Navbar;
