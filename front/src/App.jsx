import React, { useState } from "react";
import axios from "axios";

const LatexToPDF = () => {
  const [latex, setLatex] = useState(
    "\\documentclass{article}\n\\begin{document}\nHello, LaTeX!\n\\end{document}"
  );
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/generate-pdf", { latex }, { responseType: "blob" });

      // Create a blob URL to preview the PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-4">LaTeX to PDF Converter</h2>
        
        <label className="block text-gray-700 font-semibold mb-2">Enter LaTeX Code:</label>
        <textarea
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          rows={8}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-gray-800"
        />
        
        <div className="flex justify-center mt-6">
          <button
            onClick={generatePDF}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-300 shadow-md ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-900"
            }`}
          >
            {loading ? "Generating..." : "Generate PDF"}
          </button>
        </div>

        {pdfUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-blue-700 text-center">PDF Preview</h3>
            <div className="border border-blue-400 rounded-lg overflow-hidden mt-3 shadow-md">
              <iframe src={pdfUrl} width="100%" height="500px" className="w-full"></iframe>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={downloadPDF}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300 shadow-md"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatexToPDF;
