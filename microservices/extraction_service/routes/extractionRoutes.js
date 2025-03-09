const express = require('express'); 
const ExtractionController = require('../controllers/extractionController');

const router = express.Router();

router.post('/upload', ExtractionController.extractAndSave);

module.exports = router;

