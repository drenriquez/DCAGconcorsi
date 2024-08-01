require('dotenv').config({ path: '../.env' });
const express = require('express');
const ConcorsiEsterniCollectionDao = require('../dao/concorsiEsterniDao');
const concorsiEsterniCollectionDao = new ConcorsiEsterniCollectionDao();

class ConcorsiEsterniCollectionController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/concorsiEsterniLista', this.getAll.bind(this));
    }
// alessia del muto
async getAll(req, res) {
    try {
        const result = await concorsiEsterniCollectionDao.findAll;
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
getRouter() {
    return this.router;
}
}
module.exports = ConcorsiEsterniCollectionController