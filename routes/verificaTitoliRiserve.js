require('dotenv').config({path:'../.env'});
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/verificaTitoliRiserve', function(req, res, next) {
  const apiUserURL=process.env.HOST_SERVER_API
  const concorsoId = req.query.id;
  const codiceFiscaleCandidato=req.query.codiceFiscaleCandidato
  //console.log(concorsoId)
  res.render('verificaTitoliRiserve', {
    concorsoId: concorsoId, 
    codiceFiscaleCandidato: codiceFiscaleCandidato,
    apiUserURL: apiUserURL 
   });
});

module.exports = router;