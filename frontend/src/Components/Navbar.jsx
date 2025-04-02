
import React, { useState } from "react";
import { Link } from "react-router-dom";

import Info from "./info";

const Navbar = () => {
  
  // State to manage the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav className="bg-[#F8F9FB] text-black py-4 h-[10vh]">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-lg font-semibold hover:text-blue-700">
          LaTeX Converter
        </Link>
        <div >
          {/* Question Paper button that toggles the dropdown */}
          <button
            onClick={toggleDropdown}
            className="px-4 py-2 hover:bg-blue-500 rounded"
          >
            Question Paper
          </button>
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute bg-gray-700 text-white mt-2 rounded shadow-lg">
              <Link
                to="/series"
                className="block px-4 py-2 hover:bg-blue-500"
                onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
              >
                series exam template
              </Link>
              <Link
                to="/semester"
                className="block px-4 py-2 hover:bg-blue-500"
                onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
              >
                Semester exam template
              </Link>
            </div>
          )}
        </div>
        <div>
            <button
            onClick={() =>  window.open("/info","_blank","noopener,noreferrer")}
            className="px-4 py-2 hover:bg-blue-500 rounded"
          >
            Instructions
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
