import React, { useState } from "react";
import { logo } from "../utils";
import { navLists } from "../constants";
import { HashLink as Link } from "react-router-hash-link";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
          <p className="font-menulis px-4 pl-2 pt-4 text-white hover:text-white text-[1.87rem] lg:md:text-4xl transition-all">
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
              className="px-6 cursor-pointer text-white hover:text-white text-xl transition-all"
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
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-transparent backdrop-blur-md z-40">
          <div className="flex flex-col items-center py-4">
            {navLists.map((nav) => (
              <Link
                key={nav}
                to={`/#${nav.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-white text-lg hover:text-gray-300 transition-all"
                scroll={(el) =>
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {nav}
              </Link>
            ))}

            <Link
              to="/#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4"
              scroll={(el) =>
                el.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-md text-white font-medium hover:from-red-500 hover:to-red-700 transition-all">
                Jetzt Kontaktieren
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
