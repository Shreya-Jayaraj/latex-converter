const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(express.json());  // Parse JSON requests
app.use(cors());  // Enable CORS for frontend requests

// API to generate PDF from LaTeX
app.post("/generate-pdf", (req, res) => {
  const latexCode = req.body.latex;
  const latexFile = "document.tex";
  const pdfFile = "document.pdf";

  // Write LaTeX code to a file
  fs.writeFileSync(latexFile, latexCode);

  // Run LaTeX compiler (pdflatex) to generate PDF
  exec(`pdflatex -interaction=nonstopmode ${latexFile}`, (error) => {
    if (error) {
      console.error("LaTeX Compilation Error:", error);
      return res.status(500).send("Error generating PDF");
    }

    // Send the PDF file as a response
    res.sendFile(`${__dirname}/${pdfFile}`, () => {
      fs.unlinkSync(latexFile); // Cleanup
      fs.unlinkSync(pdfFile);
    });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
