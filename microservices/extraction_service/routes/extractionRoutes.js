const express = require('express'); 
const dotenv = express('dotenv');

const app = express();
dotenv.config();

const router = express.Router();


const extractionController = ('./controllers/extractionController');

router.post('/', extractionController);

module.exports = router;

