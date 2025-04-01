const express = require("express");
const { getTemplates, saveTemplate, deleteTemplate, generatePDF } = require("../controllers/latexController");

const router = express.Router();

router.get("/templates", getTemplates);  // Get all templates
router.post("/save-template", saveTemplate); // Save a new template
router.delete("/templates/:id", deleteTemplate); // Delete a template
router.post("/generate-pdf", generatePDF); // Generate PDF

module.exports = router;
