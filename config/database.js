require('dotenv').config({path:'../.env'});
module.exports = {
    dbURI: process.env.DB_URI,
    dbName: process.env.DB_NAME,
  };
  