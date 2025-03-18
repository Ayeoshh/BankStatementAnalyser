const express = require('express');
const router = express.Router();
const axios = require('axios');

const multer = require('multer'); // Middleware for handling file uploads
const FormData = require('form-data'); 
const fs = require('fs'); 

const upload = multer({ dest: 'uploads/' }); // Temporary upload directory


// authentication 
const authController = require('./controllers/authController');
const authMiddleware = require('../shared/middlewares/authMiddleware');
const validateSchema = require('../shared/utils/validateSchema');
const {registerSchema} = require('../shared/utils/registerSchema');

router.post('/register', validateSchema(registerSchema), authController.register);

router.post('/login', authController.login);

router.get('/protected', authMiddleware, authController.protectedRoute);



//extraction microservice
const EXTRACTION_SERVICE_URL = 'http://localhost:5001';

router.post('/upload', upload.single('file'), async (req, res) => {
    console.log("starting of upload");
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const response = await axios.post(`${EXTRACTION_SERVICE_URL}/upload/upload`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error forwarding the request:', error.message);
        res.status(500).json({ message: 'Error forwarding the request' });
    }
});

// analysis microservice
const ANALYSIS_SERVICE_URL = 'http://localhost:5002';

router.post('/analysis', async (req, res)=>{
    try{
        const response = await axios.post(`${ANALYSIS_SERVICE_URL}/analysis/analysis`, req.body);
        res.status(200).json(response.data);

    }catch (error){
        console.error('Error forwarding the request:', error.message);
        res.status(500).json({message: 'Error forwarding the request'});
    }
})

// // router.post('/upload', authMiddleware, async (req, res)=>{
// router.post('/upload', async (req, res)=>{
//     try{
//         const response = await axios.post(`${EXTRACTION_SERVICE_URL}/upload`, req.body, {
//             headers:req.headers});
//         res.status(200).json(response.data);
//     }catch(error){
//         console.error('Error forwarding the request:', error.message);
//         res.status(500).json({message: 'Error forwarding the request'});
//     }
// });

//analysis microservice



module.exports = router;