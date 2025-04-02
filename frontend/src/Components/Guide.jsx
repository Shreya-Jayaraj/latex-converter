import React from 'react';
import { BookOpen } from 'lucide-react';

function Guide() {
  return (
    <div className="container mx-auto px-4 py-4 mt-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border  border-[#1e4b9c]">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-6 h-6 text-[#1e4b9c]" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e4b9c]">Quick LaTeX Guide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white rounded-lg shadow-sm border border-[#1e4b9c] p-4">
            <h3 className="font-bold text-[#1e4b9c] mb-2">Basic Structure</h3>
            <ul className="space-y-1  text-gray-600 text-sm font-medium rounded-t-lg ">
              <li><code>{"\\documentclass{article}"}</code> - Start document</li>
              <li><code>{"\\begin{document}"}</code> - Begin content</li>
              <li><code>{"\\end{document}"}</code> - End content</li>
              <li><code>{"\\section{Title}"}</code> - Create section</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#1e4b9c] p-4">
            <h3 className="font-bold text-[#1e4b9c] mb-2">Equations</h3>
            <ul className="space-y-1  text-gray-600 text-sm font-medium rounded-t-lg ">
              <li><code>{"$x^2$"}</code> - Inline math</li>
              <li><code>{"\\[ x^2 \\]"}</code> - Display math</li>
              <li><code>{"\\begin{equation}"}</code> - Numbered equation</li>
              <li><code>{"\\frac{a}{b}"}</code> - Fractions</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#1e4b9c] p-4">
            <h3 className="font-bold text-[#1e4b9c] mb-2">Images & Tables</h3>
            <ul className="space-y-1 text-sm font-medium rounded-t-lg text-gray-600">
              <li><code>{"\\usepackage{graphicx}"}</code> - Enable images</li>
              <li><code>{"\\includegraphics{file}"}</code> - Insert image</li>
              <li><code>{"\\begin{tabular}"}</code> - Create table</li>
              <li><code>{"\\begin{figure}"}</code> - Figure environment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
