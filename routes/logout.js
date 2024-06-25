const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

/* GET home page. */
router.get('/logout',userAuth, function(req, res, next) {
    req.session.isAuthenticated=false
    req.session.destroy();
    res.redirect('/login')
    console.log("test logout");
});

module.exports = router;
