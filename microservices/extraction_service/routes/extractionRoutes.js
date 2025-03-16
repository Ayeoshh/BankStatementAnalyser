const express = require('express'); 
const ExtractionController = require('../controllers/extractionController');
console.log('reached extraction routes in microservice')
const router = express.Router();


const multer = require('multer');

// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: multer.memoryStorage() });

// router.post('/upload', upload.single('file'), (req, res) => {
//     console.log('Received file:', req.file);
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }
//     res.status(200).json({ message: 'File received successfully', file: req.file });
// });

router.post('/upload', upload.single('file'), ExtractionController.extractAndSave);

module.exports = router;

