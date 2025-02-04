require('dotenv').config({path:'../.env'});
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/inserimentoProve', function(req, res, next) {
  const apiUserURL=process.env.HOST_SERVER_API
  const concorsoId = req.query.id;
 // const concorsoTipoProva=req.query.tipoProva;
  //console.log(concorsoId)
  res.render('inserimentoProve', {
    concorsoId: concorsoId, 
    livelloUser: req.session.livelloUser,
    userCodFisc: req.session.codiceFiscale,
    livelloUser: req.session.livelloUser,
    apiUserURL: apiUserURL 
   });
});

module.exports = router;