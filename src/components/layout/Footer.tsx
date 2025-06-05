import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, UtensilsCrossed } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-primary-50 via-secondary to-white border-t border-muted rounded-t-2xl shadow-inner">
      <div className="container px-4 py-10 mx-auto md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center mb-4 space-x-2 group">
              <UtensilsCrossed className="w-7 h-7 text-primary-500 group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-extrabold text-primary-500 tracking-tight">
                CampusEats
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The marketplace for student food and snacks at your University by
              your versity Meets. Order from student vendors on campus anytime.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-primary-700">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/market", label: "Market" },
                { to: "/vendor/register", label: "Become a Vendor" },
                { to: "/login", label: "Login" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="relative text-muted-foreground hover:text-primary-500 transition-colors after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-0.5 after:bg-primary-500 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-primary-700">
              Contact the Developer
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground font-medium">
                Hlulani Bliss Mahlathi
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary-500" />
                <a
                  href="mailto:blissmahlathi37@gmail.com"
                  className="hover:text-primary-500 transition-colors"
                >
                  blissmahlathi37@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary-500" />
                <a
                  href="tel:+27715231720"
                  className="hover:text-primary-500 transition-colors"
                >
                  (+27) 71 523 1720
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-10 border-t border-muted">
          <p className="text-xs text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} CampusEats. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
