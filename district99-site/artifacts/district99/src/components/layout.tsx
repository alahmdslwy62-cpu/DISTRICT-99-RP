import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoUrl from "@assets/image_1784548542182-B_34P9Wg_1784561566274.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/activation", label: "طلب التفعيل" },
    { href: "/rules", label: "القوانين" },
    { href: "/store", label: "المتجر" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,229,255,0.05)]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            <img 
              src={logoUrl} 
              alt="District 99 Logo" 
              className="h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.5)] transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? "text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                      initial={false}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/activation"
              className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/50 rounded-md font-bold text-sm 
                       transition-all duration-300 hover:bg-primary hover:text-primary-foreground 
                       hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              انضم الآن
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl md:hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium ${
                    location === link.href
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/activation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-center shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                انضم الآن
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full pt-20">
        {children}
      </main>

      <footer className="bg-background border-t border-white/5 py-12 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="District 99 Logo" className="h-10 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
            <span className="text-muted-foreground text-sm font-medium tracking-wider">
              DISTRICT 99 ROLEPLAY &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/rules" className="hover:text-primary transition-colors">القوانين والشروط</Link>
            <Link href="/store" className="hover:text-primary transition-colors">المتجر</Link>
            <Link href="/admin" className="hover:text-primary transition-colors opacity-40 hover:opacity-100">admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
