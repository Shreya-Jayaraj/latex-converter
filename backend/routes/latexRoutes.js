const express = require("express");
const { getTemplates, saveTemplate, deleteTemplate, generatePDF, uploadImage } = require("../controllers/latexController");
const upload = require("../middleware/imageMiddleware");
const router = express.Router();

router.get("/templates", getTemplates);  
router.post("/save-template", saveTemplate); 
router.delete("/templates/:id", deleteTemplate); 
router.post("/generate-pdf", generatePDF); 
router.post("/image-upload",upload.single("image"),uploadImage);

module.exports = router;
