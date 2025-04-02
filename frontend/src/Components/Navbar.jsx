import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // State to manage the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav className="bg-[#F8F9FB] text-black relative py-4 h-[12vh] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]">
 
      <div className="container mx-auto px-6 flex justify-between items-center">          
        <Link to="/" className="text-2xl font-bold gradient-text hover:text-blue-700">
          LaTeX Converter
        </Link>
        
        {/* Dropdown Container */}
        <div className="relative">
        <button
        onClick={toggleDropdown}
        className="text-lg font-semibold px-4 py-2 relative cursor-pointer z-10
          after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px]
          after:bg-[#1e4b9c] after:transition-all after:duration-300
          hover:after:w-full"
        >
        Question Paper
        </button>


          {/* Dropdown menu with smooth transition */}
          <div
            className={`absolute left-0 bg-gray-700 text-white mt-2 rounded shadow-lg transition-all duration-300 ease-in-out transform z-10 ${
              isDropdownOpen ? "opacity-100 translate-y-2 scale-100" : "opacity-0 translate-y-[-10px] scale-95 pointer-events-none"
            }`}
          >
            <Link
              to="/series"
              className="block px-4 py-2 hover:bg-blue-500"
              onClick={() => setIsDropdownOpen(false)} 
            >
              Series Exam Template
            </Link>
            <Link
              to="/semester"
              className="block px-4 py-2 hover:bg-blue-500"
              onClick={() => setIsDropdownOpen(false)} 
            >
              Semester Exam Template
            </Link>
          </div>
        </div>

        {/* Instructions Button - Opens in New Tab */}
        <div>
          <button
            onClick={() => window.open("/info", "_blank", "noopener,noreferrer")}
            className="text-lg font-semibold px-4 py-2 relative cursor-pointer z-10
          after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px]
          after:bg-[#1e4b9c] after:transition-all after:duration-300
          hover:after:w-full"
          >
            Instructions
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
