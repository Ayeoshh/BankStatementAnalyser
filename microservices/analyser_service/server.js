const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config({path: '../../.env'});

const PORT = 5002;

const analysisRoutes = require('./routes/analysisRoutes');
console.log("reached analyser microservice***********")
app.use('/analysis', analysisRoutes);

app.use((req, res, next)=>{
    res.status(404).json({message: 'Route not found'});
    next();
});

app.use((err, req, res, next)=>{
    res.status(500).json({message: err.message});
    next();
});

app.listen(PORT, ()=>{
    console.log(`Analysis service running on port ${PORT}`);
});



