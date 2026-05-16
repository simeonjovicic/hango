import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { Link as RouterLink } from "react-router-dom"; // Import regular Link

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Branding and Navigation */}
        <div className="flex flex-col items-center justify-between gap-4 py-5 md:flex-row md:gap-0 md:py-14">
          {/* Branding */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-extrabold md:text-4xl">Hango</h2>
            <p className="mt-1 text-sm text-gray-400 md:mt-2 md:text-xl">
              Ihre Digitalagentur
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm md:gap-10 md:text-lg">
            {/* Regular Links for separate pages */}
            <RouterLink
              to="/impressum"
              className="text-gray-300 hover:text-white transition py-1"
            >
              Impressum
            </RouterLink>
            <RouterLink
              to="/privacy-policy"
              className="text-gray-300 hover:text-white transition py-1"
            >
              Privacy Policy
            </RouterLink>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-4 pb-5 text-center md:pt-6 md:pb-8">
          <p className="text-xs text-gray-500 md:text-base">
            &copy; {new Date().getFullYear()} Hango. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
