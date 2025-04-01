const fs = require("fs");
const { exec } = require("child_process");
const Template = require("../models/template");
const path = require("path");


exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveTemplate = async (req, res) => {
  try {
    const { name, latexCode } = req.body;
    const newTemplate = new Template({ name, latexCode });
    await newTemplate.save();
    res.status(201).json({ message: "Template saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Template deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.generatePDF = async (req, res) => {
    try {
      let latexCode = req.body.latex;
  
      if (req.body.templateId) {
        const template = await Template.findById(req.body.templateId);
        if (!template) return res.status(404).json({ message: "Template not found" });
        latexCode = template.latexCode;
      }
  
      const latexFile = path.join(__dirname, "../uploads/document.tex");
      const pdfFile = path.join(__dirname, "../uploads/document.pdf");
  
      // Write the LaTeX code to a temporary file
      fs.writeFileSync(latexFile, latexCode);
  
      // Generate the PDF using pdflatex
      exec(`pdflatex -interaction=nonstopmode -output-directory=uploads ${latexFile}`, (error) => {
        if (error) {
          console.error("LaTeX Compilation Error:", error);
          return res.status(500).send("Error generating PDF");
        }
  
        // Send the PDF as a binary stream
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=document.pdf");
  
        const pdfStream = fs.createReadStream(pdfFile);
        pdfStream.pipe(res);
  
        // Clean up the temporary files after sending the PDF
        pdfStream.on("end", () => {
          fs.unlinkSync(latexFile);
          fs.unlinkSync(pdfFile);
        });
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
