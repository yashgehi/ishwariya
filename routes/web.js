const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController');


router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/sign-up', AuthController.signUp);

module.exports = router;