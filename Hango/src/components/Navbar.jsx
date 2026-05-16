import React, { useState, useEffect } from "react";
import { logo } from "../utils";
import { navItems } from "../constants";
import { HashLink as Link } from "react-router-hash-link";

const ChevronIcon = () => (
  <svg
    className="hango-mobile-link-icon"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7.5 5l5 5-5 5" />
  </svg>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const scrollTo = (el) =>
    el.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <header
        className={`hango-nav hango-nav-enter fixed top-0 left-0 right-0 z-50 ${
          scrolled ? "hango-nav--scrolled" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[3.75rem] sm:h-16 flex items-center justify-between gap-4">
          <Link
            to="/#home"
            className="hango-nav-brand flex items-center gap-2.5 shrink-0"
            scroll={scrollTo}
          >
            <img
              src={logo}
              alt="Hango"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
            <span className="font-menulis text-[1.65rem] sm:text-[1.85rem] leading-none text-black tracking-tight">
              Hango
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-7 lg:gap-9"
            aria-label="Hauptnavigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={`/#${item.href}`}
                className="hango-nav-link py-1"
                scroll={scrollTo}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/#kontakt"
              className="hango-nav-cta hidden sm:inline-flex items-center px-5 py-2"
              scroll={scrollTo}
            >
              Kontakt
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isMobileMenuOpen}
              className="hango-nav-menu-btn md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/50 backdrop-blur border border-black/8 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
            >
              <span className="relative w-5 h-3.5 flex flex-col justify-between">
                <span
                  className={`block h-[2px] bg-black rounded-full transition-all duration-300 origin-center ${
                    isMobileMenuOpen ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-black rounded-full transition-all duration-200 ${
                    isMobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-[2px] bg-black rounded-full transition-all duration-300 origin-center ${
                    isMobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
          <button
            type="button"
            className="hango-mobile-backdrop md:hidden"
            onClick={closeMenu}
            aria-label="Menü schließen"
          />

          <div
            className="hango-mobile-panel md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="hango-mobile-panel-header">
              <p className="hango-mobile-panel-label">Navigation</p>
            </div>

            <nav className="hango-mobile-panel-body" aria-label="Seitennavigation">
              <ul>
                {navItems.map((item, i) => (
                  <li
                    key={item.href}
                    className="hango-mobile-link-item"
                    style={{ animationDelay: `${80 + i * 55}ms` }}
                  >
                    <Link
                      to={`/#${item.href}`}
                      onClick={closeMenu}
                      className="hango-mobile-link"
                      scroll={scrollTo}
                    >
                      <span>{item.label}</span>
                      <ChevronIcon />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hango-mobile-footer">
              <Link
                to="/#kontakt"
                onClick={closeMenu}
                className="hango-mobile-cta"
                scroll={scrollTo}
              >
                Jetzt Kontaktieren
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
