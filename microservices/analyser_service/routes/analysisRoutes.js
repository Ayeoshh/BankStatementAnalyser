const express = require('express');
const router = express.Router();

const analysisController = require('../controllers/analysisController');

console.log("reached analysis Routes*********")
router.post('/analysis', analysisController.getAnalysis);
// router.get('/analysis/:customerId', analysisController.getAnalysis);

module.exports = router;