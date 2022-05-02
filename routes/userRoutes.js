let express = require('express');
let router = express.Router();
let UserController = require('../controllers/UserController');

router.post('/signup', UserController.signup);		//rôle: creation d'utilisateur

router.post('/login', UserController.login);

module.exports = router;