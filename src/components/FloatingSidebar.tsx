import { Home, Briefcase, Info, Mail, Menu, X } from "lucide-react";
import { useState } from "react";

export const FloatingSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Home", href: "#hero" },
    { icon: Briefcase, label: "Work", href: "#work" },
    { icon: Info, label: "About", href: "#about" },
    { icon: Mail, label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 left-6 z-50 glass p-3 rounded-full glow-primary hover:scale-110 transition-transform"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-[200%]"
        }`}
      >
        <nav className="glass-strong rounded-full p-4 glow-primary">
          <ul className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-center w-12 h-12 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 relative"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="absolute left-16 whitespace-nowrap glass px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
