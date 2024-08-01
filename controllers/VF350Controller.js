require('dotenv').config({ path: '../.env' });
const express = require('express');
const  VF350Dao = require('../dao/VF350Dao'); 
const iLGDao = new  VF350Dao();

class VF350Controller {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/VF350Candidati', this.getAllCandidati.bind(this));
        this.router.get('/VF350Candidati/:id', this.getCandidatoById.bind(this));
        this.router.post('/VF350Candidati', this.createCandidato.bind(this));
        this.router.put('/VF350Candidati/:id', this.updateCandidato.bind(this));
       // this.router.delete('/VF350Candidati/:id', this.deleteCandidatoById.bind(this));
       //this.router.delete('/VF350deleteCandidatoByCodiceFiscale', this.deleteCandidatoByCodiceFiscale.bind(this));
        this.router.get('/VF350Candidati/cognome/:cognome', this.getCandidatiByCognome.bind(this));
        this.router.get('/VF350Candidati/codiceFiscale/:codiceFiscale', this.getCandidatoByCodiceFiscale.bind(this));https://172.16.17.11/api/VF350Candidati/codiceFiscale/RNZMTT97S15H294R
        this.router.post('/VF350CandidatiByCodiciFiscali', this.getCandidatiByCodiciFiscali.bind(this));
        this.router.get('/VF350CandidatiNonAmmessi', this.getAllNonAmmessi.bind(this));//https://172.16.17.11/api/VF350CandidatiNonAmmessi
        this.router.get('/VF350CandidatiRecapiti', this.getCandidatiRecapiti.bind(this)); // https://172.16.17.11/api/VF350CandidatiRecapiti?codiciFiscali=TRVDRA80L24F839E,MNZCLN82L03G273A
        this.router.put('/VF350CandidatiUpdateList', this.updateCandidati.bind(this));
        this.router.get('/VF350CandidatiByIdStep/:idStep', this.getCandidatiByIdStep.bind(this));
        this.router.put('/VF350updateIterConcorsoByCodiciFiscali', this.updateIterConcorsoByCodiciFiscali.bind(this));//passare come body {"TRVDRA80L24F839E":{ "idStep": 0, ...}, "TRVDRA80L24F839E":{ "idStep": 0, ...}}
        this.router.get('/VF350CandidatiByNomeCognome', this.getCandidatiByNomeCognome.bind(this)); //
        this.router.get('/VF350countCandidati', this.countCandidati.bind(this)); 
        this.router.put('/VF350updateIterConcorso', this.updateIterConcorso.bind(this));
        this.router.put('/VF350addIterConcorso', this.addIterConcorso.bind(this));
        this.router.get('/VF350CandidatiAmmessi', this.getCandidatiAmmessiSorted.bind(this));
        this.router.get('/VF350CandidatiWithLastDomandaConcorso', this.getCandidatiWithLastDomandaConcorso.bind(this));
        this.router.get('/VF350CandidatiCNVVF', this.getCNVVFCandidates.bind(this));
        this.router.get('/VF350CandidatiInvaliditaCivile', this.getInvaliditaCivileCandidates.bind(this)); 
        this.router.get('/VF350CandidatiDSA', this.getDSACandidates.bind(this));
    }
// alessia del muto
    async getAllCandidati(req, res) {
        try {
            const candidati = await iLGDao.findAll();
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiByIdStep(req, res) {
        try {
            const { idStep } = req.params;
            const candidati = await iLGDao.findByIdStep(parseInt(idStep));
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatoById(req, res) {
        try {
            const candidato = await iLGDao.findById(req.params.id);
            if (!candidato) {
                return res.status(404).json({ error: 'Candidato not found' });
            }
            res.json(candidato);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createCandidato(req, res) {
        try {
            const candidato = await iLGDao.create(req.body);
            res.status(201).json(candidato);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCandidato(req, res) {
        try {
            console.log('+++++++++test updateCandidato')
            const candidato = await iLGDao.updateById(req.params.id, req.body);
            if (!candidato) {
                return res.status(404).json({ error: 'Candidato not found' });
            }
            res.json(candidato);
        } catch (error) {
            console.log('+++++++++test updateCandidato error')
            res.status(500).json({ error: error.message });
        }
    }

    async deleteCandidatoById(req, res) {
        try {
            const candidato = await iLGDao.deleteById(req.params.id);
            if (!candidato) {
                return res.status(404).json({ error: 'Candidato not found' });
            }
            res.json({ message: 'Candidato deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteCandidatoByCodiceFiscale(req, res) {//da controllare
        try {
            const candidato = await iLGDao.deleteByCodiceFiscale(req.params.cf);
            if (!candidato) {
                return res.status(404).json({ error: 'Candidato not found' });
            }
            res.json({ message: 'Candidato deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCandidatiByCognome(req, res) {
        try {
            const candidati = await iLGDao.findByCognome(req.params.cognome);
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

   

    async getCandidatoByCodiceFiscale(req, res) {
        try {
            const candidato = await iLGDao.findByCodiceFiscale(req.params.codiceFiscale);
            if (!candidato) {
                return res.status(404).json({ error: 'Candidato non trovato' });
            }
            res.json(candidato);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiByCodiciFiscali(req, res) {
        try {
            const { codiciFiscali } = req.body;
            if (!codiciFiscali || !Array.isArray(codiciFiscali)) {
                return res.status(400).json({ error: "codiciFiscali must be an array" });
            }
            const candidati = await iLGDao.findByCodiceFiscaleList(codiciFiscali);
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAllNonAmmessi(req, res) {
        try {
            const candidati = await iLGDao.findNotAmmessi();
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiRecapiti(req, res) {
        try {
            const codiciFiscali = req.query.codiciFiscali ? req.query.codiciFiscali.split(',') : null;
            const candidati = await iLGDao.findRecapitiByCodiceFiscaleList(codiciFiscali);
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateCandidati(req, res) {
        try {
            console.log('+++++++++test updateCandidati')
            const candidatiUpdateList = req.body;
            const result = await iLGDao.updateRecapitiByCodiceFiscaleList(candidatiUpdateList);
            res.json(result);
        } catch (error) {
            console.log('+++++++++test updateCandidati')
            res.status(500).json({ error: error.message });
        }
    }
    async updateIterConcorsoByCodiciFiscali(req, res) {
        try {
            const codiciFiscaliUpdates = req.body;
            const result = await iLGDao.updateIterConcorsoByCodiciFiscali(codiciFiscaliUpdates);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiByNomeCognome(req, res) {
        try {
            const { nome, cognome } = req.query;
            const candidati = await iLGDao.findCandidatiByNomeCognome(nome, cognome);
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async countCandidati(req, res) {
        try {
            const count = await iLGDao.countCandidati();
            res.json({ count });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateIterConcorso(req, res) {
        const { codiceFiscale, idStep, updateData } = req.body;
        try {
            const result = await iLGDao.updateIterConcorso(codiceFiscale, idStep, updateData);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async addIterConcorso(req, res) {
        const { codiceFiscale, newIterConcorso } = req.body;
        try {
            const result = await iLGDao.addIterConcorso(codiceFiscale, newIterConcorso);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiAmmessiSorted(req, res) {
        try {
            const result = await iLGDao.getAmmessiSortedByCognomeAndNome();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiWithLastDomandaConcorso(req, res) {
        try {
            const result = await iLGDao.getAllDocumentsWithLastDomandaConcorso();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCNVVFCandidates(req, res) {
        try {
            const result = await iLGDao.getAllCNVVFCandidates();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getInvaliditaCivileCandidates(req, res) {
        try {
            const result = await iLGDao.getAllInvaliditaCivileCandidates();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getDSACandidates(req, res) {
        try {
            const result = await iLGDao.getAllDSACandidates();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    getRouter() {
        return this.router;
    }
}

module.exports = VF350Controller;
