const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/home',userAuth, function(req, res, next) {
  res.render('home', { 
    title: 'DCAGconcorsi',
    userCodFisc: req.session.codiceFiscale,
    livelloUser: req.session.livelloUser,
   });
});

module.exports = router;
