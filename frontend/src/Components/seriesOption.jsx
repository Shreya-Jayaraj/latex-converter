import React from 'react';
import { Link } from 'react-router-dom';

const SeriesOption = () => {
  return (
    <div className="min-h-screen flex flex-col items-center  bg-[#f8f9fb] px-4 ">
      <h2 className="text-3xl font-bold text-center mb-8">Choose an Option</h2>
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl">
        
        {/* Auto-LaTeX Option */}
        <Link 
          to="/series-auto-latex"
          className="bg-white border-2 border-blue-500 rounded-2xl p-6 text-center shadow hover:shadow-lg transition duration-300 hover:bg-blue-50"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Auto-LaTeX</h3>
          <p className="text-gray-600">Type questions in plain text and automatically generate LaTeX code with live preview.</p>
        </Link>

        {/* Quick Templates Option */}
        <Link 
          to="/series-template"
          className="bg-white border-2 border-green-500 rounded-2xl p-6 text-center shadow hover:shadow-lg transition duration-300 hover:bg-green-50"
        >
          <h3 className="text-xl font-semibold text-green-700 mb-2">Quick Templates</h3>
          <p className="text-gray-600">Start with ready-made templates for Series or Semester exams.</p>
        </Link>

      </div>
    </div>
  );
};

export default SeriesOption;
