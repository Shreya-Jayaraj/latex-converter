import React, { useState, useEffect, useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Download, RefreshCw } from "lucide-react";
import axios from "axios";

function series() {
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState(null);

  // Fetch LaTeX code from MongoDB
  useEffect(() => {
    const fetchLatexCode = async () => {
      try {
        const response = await axios.get("http://localhost:5000/templates"); // Adjust URL as needed
        if (response.data.length > 0) {
          setCode(response.data[0].latexCode);
        }
        console.log(response);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching LaTeX code:", err);
        setError("Failed to load LaTeX template.");
      }
    };

    fetchLatexCode();
  }, []);

  // Compile LaTeX and generate PDF preview
  const handleCompile = useCallback(async () => {
    if (!code) {
      setError("Please enter LaTeX code.");
      return;
    }

    try {
      setIsCompiling(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:5000/generate-pdf",
        { latex: code },
        { responseType: "blob" }
      );

      if (response.data && response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data);
        setPreview(url);
      } else {
        setError("Failed to generate PDF. Please try again.");
      }
    } catch (err) {
      console.error("Compilation error:", err);
      setError("Server error occurred. Please try again later.");
    } finally {
      setIsCompiling(false);
    }
  }, [code]);

  const handleDownload = async () => {
    if (!preview) return;

    try {
      const link = document.createElement("a");
      link.href = preview;
      link.setAttribute("download", "document.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(preview);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download PDF");
    }
  };

  // Automatically compile on LaTeX code change
  useEffect(() => {
    const compileTimeout = setTimeout(() => {
      handleCompile();
    }, 1000);

    return () => clearTimeout(compileTimeout);
  }, [code, handleCompile]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel: LaTeX Editor */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <MonacoEditor
            height="70vh"
            language="latex"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>

        {/* Right Panel: PDF Preview */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className={`flex items-center space-x-1 ${
                  isCompiling
                    ? "bg-gray-100 text-gray-500"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                } px-3 py-1 rounded-md transition-colors`}
              >
                <RefreshCw className={`w-4 h-4 ${isCompiling ? "animate-spin" : ""}`} />
                <span>{isCompiling ? "Compiling..." : "Refresh"}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!preview}
                className={`flex items-center space-x-1 ${
                  !preview ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700 hover:bg-green-200"
                } px-3 py-1 rounded-md transition-colors`}
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
          {preview ? (
            <embed src={preview} type="application/pdf" width="100%" height="100vh" />
          ) : (
            <div className="w-full h-[100vh] flex items-center justify-center bg-gray-50 text-gray-500">
              {isCompiling ? (
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                  <span>Generating preview...</span>
                </div>
              ) : (
                <span>No preview available</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default series;
