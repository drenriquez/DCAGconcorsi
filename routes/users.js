const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const UserDao = require('../dao/userDao');
/* GET users listing. */
router.get('/getUsersTable', userAuth, async function(req, res, next) {
  let userDao= new UserDao()
  const usersInOrder=await userDao.getAllUsersInOrdineCognome()
 
  res.json(usersInOrder);
});

module.exports = router;
