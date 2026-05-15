import React, { useState, useEffect } from "react";
import { logo } from "../utils";
import { navLists } from "../constants";
import { HashLink as Link } from "react-router-hash-link";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Navbar */}
      <header className="w-full py-3 sm:px-10 px-5 flex justify-between items-center bg-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        {/* Left Section: Logo and Name */}
        <div className="flex items-center">
          <Link
            to="/#home"
            className="flex items-center"
            scroll={(el) =>
              el.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <img
              src={logo}
              alt="Hango Logo"
              width={38}
              height={20}
              className="lg:md:ml-8 ml-1 my-1 lg:md:w-[2.8rem]"
            />
            <p className="font-menulis px-4 pl-2 pt-4 text-black hover:text-black text-[1.87rem] lg:md:text-4xl transition-all">
              Hango
            </p>
          </Link>
        </div>

        {/* Right Section: Desktop Navigation and Button */}
        <div className="flex items-center">
          <nav className="hidden sm:flex">
            {navLists.map((nav) => (
              <Link
                key={nav}
                to={`/#${nav.toLowerCase()}`}
                className="px-6 cursor-pointer text-black hover:text-gray-600 text-xl transition-all"
                scroll={(el) =>
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {nav}
              </Link>
            ))}
          </nav>
          <Link
            to="/#contact"
            className="hidden sm:block"
            scroll={(el) =>
              el.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <button
              className="mr-6 ml-6 px-[1.1rem] py-[.6rem] text-white text-3md font-medium
                        bg-gradient-to-r from-red-500 to-red-600
                        hover:from-red-500 hover:to-red-700
                        transition-all duration-300
                        shadow-lg shadow-red-500/30
                        hover:shadow-red-500/50
                        rounded-xl"
            >
              <p className="text-xl">Jetzt Kontaktieren</p>
            </button>
          </Link>

          {/* Mobile Hamburger — frosted glass Hango style */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isMobileMenuOpen}
            className="sm:hidden relative w-11 h-11 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:bg-white/55 transition-colors focus:outline-none"
          >
            <span className="relative w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-[2px] bg-black rounded-full transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] bg-black rounded-full transition-all duration-200 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-[2px] bg-black rounded-full transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu — full screen overlay. Close via burger (X) or Escape. */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl animate-fade-in-up flex flex-col"
          style={{ animationDuration: "280ms" }}
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 pt-20">
            {navLists.map((nav) => (
              <Link
                key={nav}
                to={`/#${nav.toLowerCase()}`}
                onClick={closeMenu}
                className="text-3xl font-semibold text-gray-900 hover:text-red-500 transition-colors font-roboto"
                scroll={(el) =>
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {nav}
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-10">
            <Link
              to="/#contact"
              onClick={closeMenu}
              scroll={(el) =>
                el.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              <button className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white text-lg font-semibold shadow-lg shadow-red-500/30 hover:to-red-700 transition-all">
                Jetzt Kontaktieren
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
