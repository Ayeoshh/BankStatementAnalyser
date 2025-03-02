const express = require('express');
const router = express.Router();


//define routes
const authRoutes = require("./routes/authRoutes");
const extRoutes = require("./routes/extractionRoutes");
const analyseRoutes = require("./routes/analyseRoutes");

//use of routes
router.use('/auth', authRoutes)
router.use('/extraction', extRoutes);
router.use('/analysis', analyseRoutes);

module.exports = router;