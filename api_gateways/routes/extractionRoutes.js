const express = require('express');
const router = express.Router();
const extMicroService = require('../../microservices/extraction_service/server');


//define routes
router.use('/extract', extMicroService);

module.exports = router;