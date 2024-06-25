// login.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');

/* GET login page. */
router.get(['/', '/login'], function(req, res, next) {
  res.render('login', { title: 'DCAGconcorsi' });
});

router.post('/login', authController.login);

module.exports = router;
