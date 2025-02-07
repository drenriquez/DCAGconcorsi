require('dotenv').config({path:'../.env'});
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/tabulatiPersonalizzati', function(req, res, next) {
  console.log('---------------------test router tabulatiPersonalizzati ------------ ')
  const apiUserURL=process.env.HOST_SERVER_API
  const concorsoId = req.query.id;
  const tipoProva=req.query.tipoProva;
  const dataProva=req.query.dataProva;
 // const concorsoTipoProva=req.query.tipoProva;
  //console.log(concorsoId)
  res.render('tabulatiPersonalizzati', {
    concorsoId: concorsoId, 
    livelloUser: req.session.livelloUser,
    userCodFisc: req.session.codiceFiscale,
    livelloUser: req.session.livelloUser,
    apiUserURL: apiUserURL ,
    tipoProva: tipoProva,
    dataProva: dataProva
   });
});

module.exports = router;