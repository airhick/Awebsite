import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/context/theme-provider";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-[75rem] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="backdrop-blur-[10px] rounded-full p-2">
            <Link to="/" className="block h-6">
              <img
                src={`${import.meta.env.BASE_URL}logos/aurora-logo.png`}
                alt="Aurora Logo"
                className="h-6 w-auto dark:brightness-0 dark:invert"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation - Glassmorphism Center */}
        <div className="hidden md:flex items-center justify-center relative">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 rounded-full bg-gray-200/90 dark:bg-white/10 backdrop-blur-md transition-colors duration-300" />
          {/* Border layer with mask effect */}
          <div
            className="absolute inset-0 rounded-full border border-gray-300 dark:border-white/30 transition-colors duration-300"
            style={{
              maskImage: "linear-gradient(160deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 39%, rgba(0, 0, 0, 0) 69%, rgb(0, 0, 0) 100%)",
            }}
          />
          {/* Content layer */}
          <nav className="relative flex items-center gap-7 px-6 py-3">
            {navLinks.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-800 hover:text-gray-900 dark:text-white/80 dark:hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-800 hover:text-gray-900 dark:text-white/80 dark:hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  {link.name}
                </a>
              )
            )}
          </nav>
        </div>

        {/* Desktop Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="backdrop-blur-md bg-gray-200/90 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 p-2 rounded-full border border-gray-300 dark:border-white/30 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-800 dark:text-white" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-white/80 p-2 rounded-md transition-colors duration-200 backdrop-blur-md bg-gray-200/90 dark:bg-white/10 rounded-full"
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
          <div className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-gray-300 dark:border-white/10 rounded-2xl px-4 py-4 space-y-1 transition-colors duration-300">
            {navLinks.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-800 hover:text-gray-900 dark:text-white/80 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-800 hover:text-gray-900 dark:text-white/80 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            )}
            <div className="pt-4 space-y-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between backdrop-blur-md bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 px-3 py-2 rounded-md border border-gray-300 dark:border-white/30 transition-all duration-200"
              >
                <span className="text-gray-800 dark:text-white text-base font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-800 dark:text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-800 dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

