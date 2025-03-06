import React from "react";

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-t from-[#090a0e] via-[#0a0a0f] to-[#25293b] text-white min-h-[30vh] flex items-center">
      <div className="max-w-7xl w-full mx-auto px-6 lg:px-8">
        {/* Top Section: Branding and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center py-14">
          {/* Branding */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-4xl font-extrabold text-white">
              Hango
            </h2>
            <p className="text-xl mt-3 text-gray-400">
              sadfsa dfjsald fsaldfl.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-10 text-xl">
            <a href="#" className="hover:text-gray-300 transition">
              Home
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              About
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              Services
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              Portfolio
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-lg text-gray-400">
            &copy; {new Date().getFullYear()} Hango. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
