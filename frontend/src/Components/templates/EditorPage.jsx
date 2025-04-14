import React, { useEffect, useState } from "react";
import axios from "axios";

const EditorPage = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    serial: "",
    text: "",
    marks: "",
    co: "",
    bl: "",
    section: "A",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [preview, setPreview] = useState(null);

  // 👉 Course info states
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get("http://localhost:5000/templates/67fd1a723ec68955883d02d1");
        setContent(response.data.latexCode);
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplate();
  }, []);

  const escapeLatex = (str) =>
    str.replace(/\\/g, '\\textbackslash{}')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_')
      .replace(/&/g, '\\&')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}');

  const handleCompileTemplate = async () => {
    setIsLoading(true);
    try {
      const sectionA = questions.filter(q => q.section === "A").sort((a, b) => a.serial - b.serial);
      const sectionB = questions.filter(q => q.section === "B").sort((a, b) => a.serial - b.serial);

      const formatQuestions = (qs) =>
        qs.map(q =>
          `\\item ${escapeLatex(q.text)} (Marks: ${q.marks}, CO: ${q.co}, BL: ${q.bl})`
        ).join('\n');

      const sectionALatex = sectionA.length
        ? formatQuestions(sectionA)
        : "\\item \\textit{No questions in this section}";

      const sectionBLatex = sectionB.length
        ? formatQuestions(sectionB)
        : "\\item \\textit{No questions in this section}";

      let formattedContent = content
        .replace("%%SECTION_A_QUESTIONS%%", sectionALatex)
        .replace("%%SECTION_B_QUESTIONS%%", sectionBLatex)
        .replace("%%COURSE_CODE%%", escapeLatex(courseCode))
        .replace("%%COURSE_NAME%%", escapeLatex(courseName))
        .replace("%%MAX_MARKS%%", escapeLatex(maxMarks))
        .replace("%%DATE%%", escapeLatex(date))
        .replace("%%DURATION%%", escapeLatex(duration));

      const response = await axios.post(
        "http://localhost:5000/generate-pdf",
        { latex: formattedContent },
        { responseType: "blob" }
      );

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      setPreview(url);
    } catch (error) {
      console.error("Error compiling LaTeX to PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateQuestion = () => {
    if (newQuestion.text && newQuestion.marks && newQuestion.co && newQuestion.bl && newQuestion.serial) {
      const updated = [...questions];
      if (isEditing) {
        updated[editingIndex] = newQuestion;
      } else {
        updated.push(newQuestion);
      }
      setQuestions(updated);
      setNewQuestion({ serial: "", text: "", marks: "", co: "", bl: "", section: "A" });
      setIsEditing(false);
      setEditingIndex(null);
      setShowQuestionModal(false);
    }
  };

  const handleEdit = (index) => {
    setNewQuestion(questions[index]);
    setEditingIndex(index);
    setIsEditing(true);
    setShowQuestionModal(true);
  };

  const handleDelete = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col p-4 space-y-4 bg-gray-50 overflow-y-auto">
        {/* 👉 Course Info Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Max Marks"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={handleCompileTemplate}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Compiling..." : "Compile Template"}
          </button>
          <button
            onClick={() => {
              setNewQuestion({ serial: "", text: "", marks: "", co: "", bl: "", section: "A" });
              setIsEditing(false);
              setShowQuestionModal(true);
            }}
            className="ml-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Add Question
          </button>
        </div>

        {/* Questions Preview */}
        {questions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Added Questions</h4>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2 space-y-2 text-sm">
              {questions
                .sort((a, b) => a.serial - b.serial)
                .map((q, idx) => (
                  <div key={idx} className="border-b pb-1">
                    <p><strong>{q.serial}.</strong> {q.text}</p>
                    <p>
                      <strong>Marks:</strong> {q.marks} | <strong>CO:</strong> {q.co} | <strong>BL:</strong> {q.bl} | <strong>Section:</strong> {q.section}
                    </p>
                    <div className="flex space-x-2 mt-1">
                      <button
                        className="text-blue-600 text-xs"
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 text-xs"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* PDF Preview */}
        {preview && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Preview</h4>
            <embed src={preview} type="application/pdf" width="100%" height="500px" />
          </div>
        )}
      </div>

      {/* Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-3">
            <h3 className="text-lg font-semibold text-center">
              {isEditing ? "Edit Question" : "Add Question"}
            </h3>
            <input
              className="w-full border border-gray-300 rounded px-3 py-1"
              placeholder="Serial number"
              type="number"
              value={newQuestion.serial}
              onChange={(e) => setNewQuestion({ ...newQuestion, serial: parseInt(e.target.value) })}
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-1"
              placeholder="Question text"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-1"
              placeholder="Marks"
              value={newQuestion.marks}
              onChange={(e) => setNewQuestion({ ...newQuestion, marks: e.target.value })}
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-1"
              placeholder="CO"
              value={newQuestion.co}
              onChange={(e) => setNewQuestion({ ...newQuestion, co: e.target.value })}
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-1"
              placeholder="BL"
              value={newQuestion.bl}
              onChange={(e) => setNewQuestion({ ...newQuestion, bl: e.target.value })}
            />
            <select
              className="w-full border border-gray-300 rounded px-3 py-1"
              value={newQuestion.section}
              onChange={(e) => setNewQuestion({ ...newQuestion, section: e.target.value })}
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  setIsEditing(false);
                }}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateQuestion}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
