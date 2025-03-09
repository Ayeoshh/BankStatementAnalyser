const express = require('express');
const router = express.Router();
const axios = require('axios');


// authentication 
const authController = require('./controllers/authController');
const authMiddleware = require('../shared/middlewares/authMiddleware');
const validateSchema = require('../shared/utils/validateSchema');
const {registerSchema} = require('../shared/utils/registerSchema');

router.post('/register', validateSchema(registerSchema), authController.register);

router.post('login', authController.login);

router.get('/protected', authMiddleware, authController.protectedRoute);



//extraction microservice
const EXTRACTION_SERVICE_URL = 'http://localhost:5001';

router.post('/upload', authMiddleware, async (req, res)=>{
    try{
        const response = await axios.post(`${EXTRACTION_SERVICE_URL}/upload`, req.body, {
            headers:req.headers});
        res.status(200).json(response.data);
    }catch(error){
        console.error('Error forwarding the request:', error.message);
        res.status(500).json({message: 'Error forwarding the request'});
    }
});

//analysis microservice



module.exports = router;