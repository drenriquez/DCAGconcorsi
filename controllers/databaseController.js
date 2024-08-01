require('dotenv').config({ path: '../.env' });
const express = require('express');
const DatabaseDao = require('../dao/databaseDao');
const databaseDao = new  DatabaseDao();

class DatabaseController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/databaseCollectionNames', this.getCollectionNames.bind(this));
    }
// alessia del muto
async getCollectionNames(req, res) {
    try {
        const result = await databaseDao.getCollectionNames();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
getRouter() {
    return this.router;
}
}
module.exports = DatabaseController