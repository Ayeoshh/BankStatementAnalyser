const express = require('express');

const app = express();

app.use(express.json());

const Port = 3000;



app.listen(Port, ()=>{
    console.log(`Server is running on ${Port}`);
});