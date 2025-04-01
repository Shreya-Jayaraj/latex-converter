// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = () => (
//   <nav className="bg-gray-800 text-white py-4">
//     <div className="container mx-auto flex justify-between">
//       <Link to="/" className="text-lg font-semibold hover:text-green-400">
//         LaTeX Converter
//       </Link>
//       <div>
//         <Link to="/" className="px-4 py-2 hover:bg-green-600 rounded">
//           Question Paper
//         </Link>
//         <Link to="/" className="px-4 py-2 hover:bg-green-600 rounded ml-4">
//           Another Page
//         </Link>
//       </div>
//     </div>
//   </nav>
// );

// export default Navbar;
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // State to manage the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-lg font-semibold hover:text-green-400">
          LaTeX Converter
        </Link>
        <div >
          {/* Question Paper button that toggles the dropdown */}
          <button
            onClick={toggleDropdown}
            className="px-4 py-2 hover:bg-green-600 rounded"
          >
            Question Paper
          </button>
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute bg-gray-700 text-white mt-2 rounded shadow-lg">
              <Link
                to="/series"
                className="block px-4 py-2 hover:bg-green-600"
                onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
              >
                series exam template
              </Link>
              <Link
                to="/semester"
                className="block px-4 py-2 hover:bg-green-600"
                onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
              >
                Semester exam template
              </Link>
            </div>
          )}
        </div>
        <div>
          <Link to="/" className="px-4 py-2 hover:bg-green-600 rounded">
            Another Page
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
