import React, { useState } from "react";
import { logo } from "../utils";
import { navLists } from "../constants";
import { HashLink as Link } from "react-router-hash-link";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="sm:hidden focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay — OUTSIDE the header */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-white flex flex-col"
          style={{ zIndex: 9999 }}
        >
          {/* Top bar with logo + close */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <Link
              to="/#home"
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
              scroll={(el) =>
                el.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              <img
                src={logo}
                alt="Hango Logo"
                width={38}
                height={20}
                className="ml-1 my-1"
              />
              <p className="font-menulis px-4 pl-2 pt-4 text-black text-[1.87rem]">
                Hango
              </p>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
            >
              <svg
                className="w-7 h-7 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Centered Links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {navLists.map((nav) => (
              <Link
                key={nav}
                to={`/#${nav.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-semibold text-gray-900 hover:text-red-500 transition-colors font-roboto"
                scroll={(el) =>
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {nav}
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="px-6 pb-10">
            <Link
              to="/#contact"
              onClick={() => setIsMobileMenuOpen(false)}
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
