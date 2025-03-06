import { logo } from "../utils";
import { navLists } from "../constants";

const Navbar = () => {
  return (
    <header className="w-full py-7 sm:px-10 px-5 flex justify-between items-center bg-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      {/* Left Section: Logo and Name */}
      <div className="flex items-center">
        <a href="#home" className="flex items-center">
          <img src={logo} alt="Apple" width={80} height={20} className="ml-6" />
          <p className="px-4 text-white hover:text-white text-4xl font-bold transition-all">
            Hango
          </p>
        </a>
      </div>

      {/* Right Section: Navigation and Button */}
      <div className="flex items-center">
        <nav className="flex max-sm:hidden">
          {navLists.map((nav) => (
            <a
              key={nav}
              href={`#${nav.toLowerCase()}`}
              className="px-6 cursor-pointer text-white hover:text-white text-2xl transition-all"
            >
              {nav}
            </a>
          ))}
        </nav>
        <a href="#contact">
          <button
            className="mr-6 ml-6 px-[1.5rem] py-[.8rem] text-white text-lg font-medium 
                      bg-gradient-to-r from-red-500 to-red-600 
                      hover:from-red-500 hover:to-red-700 
                      transition-all duration-300 
                      shadow-lg shadow-red-500/30 
                      hover:shadow-red-500/50 
                      rounded-xl"
          >
            <p className="text-2xl">Jetzt Kontaktieren</p>
          </button>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
