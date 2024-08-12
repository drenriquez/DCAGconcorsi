require('dotenv').config({ path: '../.env' });
const express = require('express');
const ConcorsiEsterniDao = require('../dao/concorsiEsterniDao');
const concorsiEsterniDao = new ConcorsiEsterniDao();

class ConcorsiEsterniController {
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
        console.log("test concorsiEsterniController")
        const result = await concorsiEsterniDao.findAll();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
getRouter() {
    return this.router;
}
}
module.exports = ConcorsiEsterniController