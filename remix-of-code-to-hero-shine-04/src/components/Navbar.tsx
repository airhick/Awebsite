import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-[75rem] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="backdrop-blur-[10px] rounded-full p-2">
            <Link to="/" className="block h-6">
              <img 
                src="/lovable-uploads/25b3039d-5f98-460a-9606-1510946f155d.png" 
                alt="Logo" 
                className="h-6 w-auto brightness-0 invert"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation - Glassmorphism Center */}
        <div className="hidden md:flex items-center justify-center relative">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
          {/* Border layer with mask effect */}
          <div 
            className="absolute inset-0 rounded-full border border-white/30"
            style={{
              maskImage: "linear-gradient(160deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 39%, rgba(0, 0, 0, 0) 69%, rgb(0, 0, 0) 100%)",
            }}
          />
          {/* Content layer */}
          <nav className="relative flex items-center gap-7 px-6 py-3">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center">
          <Button variant="hero" size="sm" className="rounded-[10px] px-6">
            Get Started
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-white/80 p-2 rounded-md transition-colors duration-200 backdrop-blur-md bg-white/10 rounded-full"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in mt-4">
          <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-white/80 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/80 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            ))}
            <div className="pt-4">
              <Button variant="hero" className="w-full rounded-2xl">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
