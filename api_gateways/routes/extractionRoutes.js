const express = require('express');
const axios = require('axios');
const router = express.Router();

const EXTRACTION_SERVICE_URL = 'http://localhost:5001';

router.post('/upload', async (req, res)=>{
    try{
        const response = await axios.post(`${EXTRACTION_SERVICE_URL}/upload`, req.body, {
            headers:req.headers});
        res.status(200).json(response.data);
    }catch(error){
        console.error('Error forwarding the request:', error.message);
        res.status(500).json({message: 'Error forwarding the request'});
    }
});

module.exports = router;