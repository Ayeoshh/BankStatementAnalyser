const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

const validateSchema = (schema) =>(req, res, next)=>{
    const validate = ajv.compile(schema);
    const valid = validate(req.body);

    if(!valid){
        return res.status(404).json({errors: validate.errors});
    }
    next();
};

module.exports = validateSchema;
