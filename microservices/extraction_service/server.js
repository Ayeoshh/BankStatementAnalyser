const express = require('express'); 
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const PORT = 5001;

app.use(express.json());

const extractionRoutes = require('./routes/extractionRoutes');

app.use('/extract', extractionRoutes);

app.use((req, res, next)=>{
    res.status(404).json({message: 'Route not found'});
});

app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).json({message: err.message});
})

app.listen(PORT, ()=>{
    console.log(`Extraction service running on port ${PORT}`);
})



