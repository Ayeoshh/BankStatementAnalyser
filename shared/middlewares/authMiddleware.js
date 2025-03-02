const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next)=>{
    const token = req.header('authentication');
    if(!token){
        return res.status(401).json({message: "request denied, token not provided"});
    }
    try{
        const decoded = jwt.verify(token.replace('Bearer "," '),process.env.JWT_SECRET);
        req.user = decoded
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({message: 'invalid toeken'});
    }
};