const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());

const Port = 3000;

const gateway = require('./api_gateways/gateway');

//use of routes
app.use('/api', gateway);


//handle undefined routes
app.use((req, res, next)=>{
    res.status(404).json({message: 'Route not found'});
    next();
});

//handle errors
app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).json({message: err.message});
    next();
});

app.listen(Port, ()=>{
    console.log(`Server is running on ${Port}`);
});