const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../../shared/middlewares/authMiddleware');
const validateSchema = require('../../shared/utils/validateSchema');
const {registerSchema} = require('../../shared/utils/registerSchema');

const router = express.Router();

router.post('/register', validateSchema(registerSchema), authController.register);

router.post('login', authController.login);

router.get('/protected', authMiddleware, authController.protectedRoute);

module.exports = router;
