const express = require("express");
const { getTemplates, saveTemplate, deleteTemplate, generatePDF, uploadImage, getTemplateById, extractLatex } = require("../controllers/latexController");
const upload = require("../middleware/imageMiddleware");
const pdfupload = require("../middleware/pdfMiddleware");
const router = express.Router();

router.get("/templates", getTemplates); 
router.get("/templates/:id", getTemplateById);  
router.post("/save-template", saveTemplate); 
router.delete("/templates/:id", deleteTemplate); 
router.post("/generate-pdf", generatePDF); 
router.post("/image-upload",upload.single("image"),uploadImage);
router.post("/extract-latex",pdfupload.single("latexFile"),extractLatex);

module.exports = router;
