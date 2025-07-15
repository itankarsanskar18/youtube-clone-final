const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/user');

router.post("/signUp",UserController.signUp)
router.post('/login',UserController.signIn);
router.post('/logout',UserController.logout);
router.get('/user/:id', UserController.getUserById);

module.exports = router;