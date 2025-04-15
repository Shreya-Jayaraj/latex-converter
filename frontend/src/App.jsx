import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import LatexToPDF from "./Components/LatexToPdf";
import Series from "./Components/templates/series";
import Semester from "./Components/templates/sem";
import Guide from "./Components/Guide";
import Info from "./Components/info";
import EditorPage from "./Components/templates/EditorPage";
import EditorSeries from "./Components/templates/EditorSeries"
import SeriesOption from "./Components/seriesOption";
import SemOption from "./Components/semOptions";

const AppContent = () => {
  const location = useLocation(); // Get the current route
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    document.title = "Descriptive Question Paper";
    setFadeIn(false); // Reset animation
    setTimeout(() => setFadeIn(true), 300); // Delay to trigger animation
  }, [location.pathname]); // Run on route change

  return (
    <div
      className={`bg-white h-[250vh] text-black transition-all duration-1200 ease-out transform ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      }`}
    >
      <Navbar />

      {/* Show Guide only if not on the /info page */}
      {location.pathname !== "/info" && (
        <>
          
          <Guide />
        </>
      )}

      <Routes>
        <Route path="/" element={<LatexToPDF />} />
        <Route path="/series-template" element={<Series />} />
        <Route path="/semester-template" element={<Semester />} />
        <Route path="/info" element={<Info />} /> {/* Guide is hidden here */}
        <Route path="/semester-auto-latex" element ={<EditorPage />} />
        <Route path="/series-auto-latex" element ={<EditorSeries />} />
        <Route path="/series-option" element ={<SeriesOption />} />
        <Route path="/sem-option" element ={<SemOption />} />
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
