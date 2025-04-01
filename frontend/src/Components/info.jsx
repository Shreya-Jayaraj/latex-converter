import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const Info = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
 
    setTimeout(() => setIsLoaded(true), 200);
  }, []);

  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    { title: "What is LaTeX Editor?", content: "A LaTeX editor allows users to write and compile LaTeX documents efficiently." },
    { title: "How to make a series paper?", content: "Follow a predefined template for formatting, including sections and question styles." },
    { title: "How to make a semester paper?", content: "Use specific university guidelines for formatting and structuring questions." },
    { title: "How to upload images?", content: "Click on the upload button and select images to include in your LaTeX document." },
    { title: "How to export your PDF?", content: "Once completed, click the export button to download the generated PDF." },
  ];

  return (
   
    <div className={`min-h-screen bg-white text-gray-900 p-6 transition-opacity duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <h1 className="text-2xl font-bold mb-4 text-center">Instructions</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`border border-blue-500 shadow-lg rounded-lg overflow-hidden transition-all duration-1000 transform ${
              isLoaded ? `opacity-100 translate-y-0 delay-[${index * 200}ms]` : "opacity-0 translate-y-[-30%]"
            }`}
          >
           
            <button
              onClick={() => toggleCollapse(index)}
              className="w-full flex justify-between items-center text-lg font-semibold bg-gray-100 px-4 py-3 rounded-md"
            >
              <span>{section.title}</span>
              {openIndex === index ? <ChevronDown /> : <ChevronRight />}
            </button>

           
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                openIndex === index ? "max-h-40 opacity-100 p-4" : "max-h-0 opacity-0 p-0"
              }`}
            >
              <strong className="block text-gray-700">{section.content}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Info;
