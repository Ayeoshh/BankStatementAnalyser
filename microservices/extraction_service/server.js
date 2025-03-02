const express = require('express'); 
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());

const extractionService = require('./routes/extrationRoutes');

app.use('/', extractionService);

app.use((req, res, next)=>{
    res.status(404).json({message: 'Route not found'});
});

app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).json({message: err.message});
})




