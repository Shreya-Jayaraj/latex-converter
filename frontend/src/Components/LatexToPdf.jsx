import React, { useState, useEffect, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Download, Upload, RefreshCw, Check, X } from 'lucide-react';
import axios from 'axios';

function LatexToPDF() {
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [generatedLatex, setGeneratedLatex] = useState('');

  const handleCompile = useCallback(async () => {
    if (!code) {
      setError('Please enter LaTeX code.');
      return;
    }

    try {
      setIsCompiling(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/generate-pdf', { latex: code }, { responseType: 'blob' });

      if (response.data && response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data);
        setPreview(url);
      } else {
        setError('Failed to generate PDF. Please try again.');
      }
    } catch (err) {
      console.error('Compilation error:', err);
      setError(err.response?.data?.message || 'Server error occurred. Please try again later.');
    } finally {
      setIsCompiling(false);
    }
  }, [code]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file)); // Show image preview
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
  
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
  
      const response = await axios.post('http://localhost:5000/image-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data?.imagePath) {
        const imageUrl = response.data.imagePath;
        setUploadedImageUrl(imageUrl);
  
        // Generate LaTeX code for inserting the image
        const latexCode = `\\includegraphics[width=0.8\\textwidth]{${imageUrl}}`;
        setGeneratedLatex(latexCode);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setSelectedFile(null);
      setImagePreview('');
    }
  };

  const handleDownload = async () => {
    try {
      if (!preview) return;

      const link = document.createElement('a');
      link.href = preview;
      link.setAttribute('download', 'document.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(preview);
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    }
  };

  useEffect(() => {
    const compileTimeout = setTimeout(() => {
      handleCompile();
    }, 1000);

    return () => clearTimeout(compileTimeout);
  }, [code, handleCompile]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-2 gap-6 [130vh] rounded-lg shadow-sm  border-1 border-blue-500 p-4">
        {/* Left Panel: LaTeX Editor */}
        <div className="bg-white min-h-[120vh] rounded-lg border-1 border-blue-500 shadow-lg p-4">
          <div className="flex justify-end space-x-2 mb-4">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
              />
              <div className="flex items-center space-x-1 bg-[#1e4b9c] text-white px-3 py-1 text-sm font-medium rounded-md cursor-pointer hover:bg-blue-700">
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </div>

            </label>
          </div>

          <MonacoEditor
            height="110vh"
            language="latex"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true
            }}
          />
        </div>

        {/* Right Panel: PDF Preview */}
        <div className="bg-white rounded-lg shadow-lg p-4 border-1 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              {error && (
                <div className="text-red-600 text-sm mb-2">
                  {error}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className={`flex items-center space-x-1 ${
                  isCompiling
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                } px-3 py-1 rounded-md transition-colors`}
              >
                <RefreshCw className={`w-4 h-4 ${isCompiling ? 'animate-spin' : ''}`} />
                <span>{isCompiling ? 'Compiling...' : 'Refresh'}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isCompiling || !preview}
                className={`flex items-center space-x-1 px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                  isCompiling || !preview
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

            </div>
          </div>

          {imagePreview && (
            <div className="mb-4 flex flex-col items-center">
              <p className="text-sm mb-2">Image Preview:</p>
              <img src={imagePreview} alt="Preview" className="w-60 h-auto rounded-lg shadow-md" />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleConfirmUpload}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>OK</span>
                </button>
                <button
                  onClick={() => { setSelectedFile(null); setImagePreview(''); }}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}

          {/* {uploadedImageUrl && (
            <div className="mt-4 p-2 bg-gray-100 rounded-md text-center">
              <p className="text-sm">Image Path:</p>
              <code className="text-blue-600 break-all">{uploadedImageUrl}</code>
            </div>
          )} */}
          {generatedLatex && (
            <div className="mt-4 p-2 bg-gray-100 rounded-md">
              <p className="text-sm font-semibold text-black">LaTeX Code for Image: paste this line of code where you want to insert the image</p>
              <div className="flex items-center">
                <code className="text-blue-600 bg-white px-2 py-1 rounded-md border border-gray-300 flex-1">
                  {generatedLatex}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLatex);
                    setGeneratedLatex('');}}
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {preview ? (
            <embed src={preview} type="application/pdf" width="100%" height="90%" />
          ) : (
            <div className="w-full h-[90%] flex items-center justify-center bg-gray-50 text-gray-500">
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

export default LatexToPDF;
