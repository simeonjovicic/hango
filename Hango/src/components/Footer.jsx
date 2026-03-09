import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { Link as RouterLink } from "react-router-dom"; // Import regular Link

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-t from-[#e5e5ea] via-[#f5f5f7] to-[#ffffff] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Branding and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 md:py-14">
          {/* Branding */}
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-extrabold">Hango</h2>
            <p className="text-lg md:text-xl mt-2 text-gray-600">
              Ihre Digitalagentur
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-base md:text-lg">
            {/* Regular Links for separate pages */}
            <RouterLink
              to="/impressum"
              className="hover:text-gray-600 transition py-1"
            >
              Impressum
            </RouterLink>
            <RouterLink
              to="/privacy-policy"
              className="hover:text-gray-600 transition py-1"
            >
              Privacy Policy
            </RouterLink>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-6 pb-8 text-center">
          <p className="text-sm md:text-base text-gray-600">
            &copy; {new Date().getFullYear()} Hango. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
