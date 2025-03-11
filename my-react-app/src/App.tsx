import React, { useState } from "react";
import axios from "axios";

const LatexToPDF = () => {
  const [latex, setLatex] = useState("\\documentclass{article}\n\\begin{document}\nHello, LaTeX!\n\\end{document}");
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
    <div>
      <h2>Enter LaTeX Code</h2>
      <textarea value={latex} onChange={(e) => setLatex(e.target.value)} rows={8} cols={50} />
      <br />
      <button onClick={generatePDF} disabled={loading}>
        {loading ? "Generating..." : "Generate PDF"}
      </button>

      {pdfUrl && (
        <>
          <h3>Preview</h3>
          <iframe src={pdfUrl} width="100%" height="500px" />
          <br />
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}
    </div>
  );
};

export default LatexToPDF;
