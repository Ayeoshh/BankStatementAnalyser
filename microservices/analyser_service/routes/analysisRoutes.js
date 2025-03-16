const express = require('express');
const router = express.Router();

const analysisController = require('../controllers/analysisController');

router.get('/analysis/:customerId', analysisController.getAnalysis);

module.exports = router;