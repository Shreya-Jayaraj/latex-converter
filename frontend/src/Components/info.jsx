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
    { title: "What is LaTeX Editor?", content: "A LaTeX editor allows users to write and compile LaTeX documents efficiently.Write your Latex code on the editor provided on the left, and the compiled preview will be displayed automatically on the right. You can also download the compiled PDF file directly from the editor or force compile the code if necessary." },
    { title: "How to save your paper?", content: "Once completed, click the \"Download pdf\" button to download the generated PDF." },
    { title: "How to make a Series Paper in short time?", content: "To create a series paper, navigate to the \"Questions\" tab in the top navbar and click on it. You'll see options for Series and Semester templates. Select \"Series\" template, and the GECT template will load in the code editor on the left. Follow this predefined template for formatting, including sections and question styles. Make any necessary edits using the Quick Guide for reference, then download the final version." },
    { title: "Can we make a semester paper too?", content: "Yes, you can create a Semester Paper as well. Follow the same steps as above, but select the \"Semester Template\" instead. The template will load in the code editor on the left, where you can make edits using the Quick Guide, and then download the final version." },
    { title: "How to upload images?", content: "Click on the \"Upload Image\" button in the top navbar. Then, click and select images to include in your LaTeX document.A preview of the image will be displayed on your screen. When you click the \"OK\" button, you will receive the required tag to use in your template code. You can paste this tag wherever you want the image to appear in your question paper." },
    { title: "How to edit an existing latex?", content: "To edit an existing LaTeX file, click on \"Upload LaTeX\", select your file, and it will be loaded into the code editor on the left. The compiled preview will be displayed on the right, allowing you to make and view changes in real time." },
    
  ];

  return (
   
    <div className={`min-h-screen bg-white  p-6 transition-opacity duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-[#1e4b9c]">Instructions</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`border border-[#1e4b9c] shadow-lg rounded-lg overflow-hidden transition-all duration-1000 transform ${
              isLoaded ? `opacity-100 translate-y-0 delay-[${index * 200}ms]` : "opacity-0 translate-y-[-30%]"
            }`}
          >
           
            <button
              onClick={() => toggleCollapse(index)}
              className="w-full flex justify-between items-center text-lg text-[#1e4b9c] font-semibold bg-gray-100 px-4 py-3 rounded-md"
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
