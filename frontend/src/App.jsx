import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import LatexToPDF from "./Components/LatexToPdf";
import Series from "./Components/templates/series";
import Semester from "./Components/templates/sem";

const App = () => (
  <Router>
    <div className="bg-gray-900 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<LatexToPDF />} />
        {/* Add additional routes here as needed */}
        <Route path="/series" element={<Series />} />
        <Route path="/semester" element={<Semester />} />
      </Routes>
    </div>
  </Router>
);

export default App;
