import React, { useState, useEffect, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Download, Upload, RefreshCw } from 'lucide-react';
import axios from 'axios';

function LatexToPDF() {
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState(null);

  const handleCompile = useCallback(async () => {
    if (!code) {
      setError('Please enter LaTeX code.');
      return;
    }

    try {
      setIsCompiling(true);
      setError(null);

      // Send LaTeX code to backend to generate PDF
      const response = await axios.post('http://localhost:5000/generate-pdf', { latex: code }, { responseType: 'blob' });

      // Check if the response is a valid PDF blob
      if (response.data && response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data);
        setPreview(url);
      } else {
        setError('Failed to generate PDF. Please try again.');
      }
    } catch (err) {
      // Check if the error is related to the server or network issues
      console.error('Compilation error:', err);
      setError(err.response?.data?.message || 'Server error occurred. Please try again later.');
    } finally {
      setIsCompiling(false);
    }
  }, [code]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload LaTeX file (optional implementation)
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.content) {
        setCode(response.data.content);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
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
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel: LaTeX Editor */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-end space-x-2 mb-4">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".tex,.txt"
                onChange={handleFileUpload}
              />
              <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </div>
            </label>
          </div>
          <MonacoEditor
            height="70vh"
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
        <div className="bg-white rounded-lg shadow-lg p-4">
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
                className={`flex items-center space-x-1 ${
                  isCompiling || !preview
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } px-3 py-1 rounded-md transition-colors`}
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
          {preview ? (
            <embed
              src={preview}
              type="application/pdf"
              width="100%"
              height="70vh"
            />
          ) : (
            <div className="w-full h-[70vh] flex items-center justify-center bg-gray-50 text-gray-500">
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
