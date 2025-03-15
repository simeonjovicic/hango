import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-t from-[#090a0e] via-[#0a0a0f] to-[#25293b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Branding and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 md:py-14">
          {/* Branding */}
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-extrabold">Hango</h2>
            <p className="text-lg md:text-xl mt-2 text-gray-400">
              Ihre Webdesign Agentur
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-base md:text-lg">
            <a href="#home" className="hover:text-gray-200 transition py-1">
              Home
            </a>
            <a href="#über-uns" className="hover:text-gray-200 transition py-1">
              Über Uns
            </a>
            <a href="#ablauf" className="hover:text-gray-200 transition py-1">
              Ablauf
            </a>
            <a href="#kontakt" className="hover:text-gray-200 transition py-1">
              Kontakt
            </a>
            <Link
              to="/impressum"
              className="hover:text-gray-200 transition py-1"
            >
              Impressum
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 pb-8 text-center">
          <p className="text-sm md:text-base text-gray-400">
            &copy; {new Date().getFullYear()} Hango. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
