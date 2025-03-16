const express = require('express'); 
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

dotenv.config({path: '../../.env'});

const PORT = 5001;

const extractionRoutes = require('./routes/extractionRoutes');
console.log('reached extraction microservice')
app.use('/upload', extractionRoutes);


app.use((req, res, next)=>{
    res.status(404).json({message: 'Route not found'});
});

app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).json({message: err.message});
})
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.DB_PORT);
// console.log(process.env.DB_DATABASE);
// console.log("Type of DB_PASSWORD:", typeof process.env.DB_PASSWORD);

app.listen(PORT, ()=>{
    console.log(`Extraction service running on port ${PORT}`);
})



