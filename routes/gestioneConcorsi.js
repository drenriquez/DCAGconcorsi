require('dotenv').config({path:'../.env'});
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/gestioneConcorsi',userAuth, function(req, res, next) {
  const apiUserURL=process.env.HOST_SERVER_API
  const concorsoId = req.query.id;
  //console.log(concorsoId)
  res.render('gestioneConcorsi', {
    concorsoId: concorsoId, 
    userCodFisc: req.session.codiceFiscale,
    livelloUser: req.session.livelloUser,
    apiUserURL: apiUserURL 
   });
});

module.exports = router;
