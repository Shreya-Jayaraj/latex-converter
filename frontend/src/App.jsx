import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import LatexToPDF from "./Components/LatexToPdf";
import Series from "./Components/templates/series";
import Semester from "./Components/templates/sem";
import Guide from "./Components/Guide";
import Info from "./Components/info";

const AppContent = () => {
  const location = useLocation(); // Get the current route
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false); // Reset animation
    setTimeout(() => setFadeIn(true), 300); // Delay to trigger animation
  }, [location.pathname]); // Run on route change

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-1200 ease-out transform ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      }`}
    >
      <Navbar />

      {/* Show Guide only if not on the /info page */}
      {location.pathname !== "/info" && (
        <>
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center mb-6">LaTeX Converter</h1>
            <p className="text-center text-gray-400 mb-4">
              Convert your LaTeX documents to PDF easily.
            </p>
          </div>
          <Guide />
        </>
      )}

      <Routes>
        <Route path="/" element={<LatexToPDF />} />
        <Route path="/series" element={<Series />} />
        <Route path="/semester" element={<Semester />} />
        <Route path="/info" element={<Info />} /> {/* Guide is hidden here */}
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
