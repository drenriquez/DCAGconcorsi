require('dotenv').config({ path: '../.env' });
const express = require('express');
const  ConcorsoGenericDao = require('../dao/concorsoGenericDao'); 
//const concorsoGenericDao = new  ConcorsoGenericDao();

class ConcorsoGenericController {
    constructor(concorso) {
        this.concorsoGenericDao=new ConcorsoGenericDao(concorso);
        this.concorso=concorso;
        this.router = express.Router();
        this.initializeRoutes();
        console.log('+++++++++++++++++++++controller Generico ',this.concorso)
    }

    initializeRoutes() {
        this.router.get(`/${this.concorso}candidati`, this.getAllCandidati.bind(this));
        this.router.get(`/${this.concorso}candidati/:id`, this.getCandidatoById.bind(this));
        this.router.post(`/${this.concorso}candidati`, this.createCandidato.bind(this));
        this.router.put(`/${this.concorso}candidati/:id`, this.updateCandidato.bind(this));
       // this.router.delete(`/${this.concorso}candidati/:id`, this.deleteCandidatoById.bind(this));
       //this.router.delete(`/${this.concorso}deleteCandidatoByCodiceFiscale`, this.deleteCandidatoByCodiceFiscale.bind(this));
        this.router.get(`/${this.concorso}candidati/cognome/:cognome`, this.getCandidatiByCognome.bind(this));
        this.router.get(`/${this.concorso}candidati/codiceFiscale/:codiceFiscale`, this.getCandidatoByCodiceFiscale.bind(this));https://172.16.17.11/api/${this.concorso}candidati/codiceFiscale/RNZMTT97S15H294R
        this.router.post(`/${this.concorso}candidatiByCodiciFiscali`, this.getCandidatiByCodiciFiscali.bind(this));
        this.router.get(`/${this.concorso}candidatiNonAmmessi`, this.getAllNonAmmessi.bind(this));//https://172.16.17.11/api/${this.concorso}candidatiNonAmmessi
        this.router.get(`/${this.concorso}candidatiRecapiti`, this.getCandidatiRecapiti.bind(this)); // https://172.16.17.11/api/${this.concorso}candidatiRecapiti?codiciFiscali=TRVDRA80L24F839E,MNZCLN82L03G273A
        this.router.put(`/${this.concorso}candidatiUpdateList`, this.updateCandidati.bind(this));
        this.router.get(`/${this.concorso}candidatiByIdStep/:idStep`, this.getCandidatiByIdStep.bind(this));
        this.router.put(`/${this.concorso}updateIterConcorsoByCodiciFiscali`, this.updateIterConcorsoByCodiciFiscali.bind(this));//passare come body {"TRVDRA80L24F839E":{ "idStep": 0, ...}, "TRVDRA80L24F839E":{ "idStep": 0, ...}}
        this.router.get(`/${this.concorso}candidatiByNomeCognome`, this.getCandidatiByNomeCognome.bind(this)); //
        this.router.get(`/${this.concorso}countCandidati`, this.countCandidati.bind(this)); 
        this.router.put(`/${this.concorso}updateIterConcorso`, this.updateIterConcorso.bind(this));
        this.router.put(`/${this.concorso}addIterConcorso`, this.addIterConcorso.bind(this));
        this.router.get(`/${this.concorso}candidatiAmmessi`, this.getCandidatiAmmessiSorted.bind(this));
        this.router.get(`/${this.concorso}candidatiWithLastDomandaConcorso`, this.getCandidatiWithLastDomandaConcorso.bind(this));
        this.router.get(`/${this.concorso}candidatiCNVVF`, this.getCNVVFCandidates.bind(this));
        this.router.get(`/${this.concorso}candidatiInvaliditaCivile`, this.getInvaliditaCivileCandidates.bind(this)); 
        this.router.get(`/${this.concorso}candidatiDSA`, this.getDSACandidates.bind(this));
    }
// alessia del muto
    async getAllCandidati(req, res) {
        try {
            const candidati = await this.concorsoGenericDao.findAll();
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiByIdStep(req, res) {
        try {
            const { idStep } = req.params;
            const candidati = await this.concorsoGenericDao.findByIdStep(parseInt(idStep));
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatoById(req, res) {
        try {
            const candidato = await this.concorsoGenericDao.findById(req.params.id);
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
            const candidato = await this.concorsoGenericDao.create(req.body);
            res.status(201).json(candidato);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCandidato(req, res) {
        try {
            console.log('+++++++++test updateCandidato')
            const candidato = await this.concorsoGenericDao.updateById(req.params.id, req.body);
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
            const candidato = await this.concorsoGenericDao.deleteById(req.params.id);
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
            const candidato = await this.concorsoGenericDao.deleteByCodiceFiscale(req.params.cf);
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
            const candidati = await this.concorsoGenericDao.findByCognome(req.params.cognome);
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

   

    async getCandidatoByCodiceFiscale(req, res) {
        try {
            const candidato = await this.concorsoGenericDao.findByCodiceFiscale(req.params.codiceFiscale);
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
            const candidati = await this.concorsoGenericDao.findByCodiceFiscaleList(codiciFiscali);
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAllNonAmmessi(req, res) {
        try {
            const candidati = await this.concorsoGenericDao.findNotAmmessi();
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiRecapiti(req, res) {
        try {
            const codiciFiscali = req.query.codiciFiscali ? req.query.codiciFiscali.split(',') : null;
            const candidati = await this.concorsoGenericDao.findRecapitiByCodiceFiscaleList(codiciFiscali);
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateCandidati(req, res) {
        try {
            console.log('+++++++++test updateCandidati')
            const candidatiUpdateList = req.body;
            const result = await this.concorsoGenericDao.updateRecapitiByCodiceFiscaleList(candidatiUpdateList);
            res.json(result);
        } catch (error) {
            console.log('+++++++++test updateCandidati')
            res.status(500).json({ error: error.message });
        }
    }
    async updateIterConcorsoByCodiciFiscali(req, res) {
        try {
            const codiciFiscaliUpdates = req.body;
            const result = await this.concorsoGenericDao.updateIterConcorsoByCodiciFiscali(codiciFiscaliUpdates);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiByNomeCognome(req, res) {
        try {
            const { nome, cognome } = req.query;
            const candidati = await this.concorsoGenericDao.findCandidatiByNomeCognome(nome, cognome);
            res.json(candidati);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async countCandidati(req, res) {
        try {
            const count = await this.concorsoGenericDao.countCandidati();
            res.json({ count });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateIterConcorso(req, res) {
        const { codiceFiscale, idStep, updateData } = req.body;
        try {
            const result = await this.concorsoGenericDao.updateIterConcorso(codiceFiscale, idStep, updateData);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async addIterConcorso(req, res) {
        const { codiceFiscale, newIterConcorso } = req.body;
        try {
            const result = await this.concorsoGenericDao.addIterConcorso(codiceFiscale, newIterConcorso);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiAmmessiSorted(req, res) {
        try {
            const result = await this.concorsoGenericDao.getAmmessiSortedByCognomeAndNome();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCandidatiWithLastDomandaConcorso(req, res) {
        try {
            const result = await this.concorsoGenericDao.getAllDocumentsWithLastDomandaConcorso();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCNVVFCandidates(req, res) {
        try {
            const result = await this.concorsoGenericDao.getAllCNVVFCandidates();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getInvaliditaCivileCandidates(req, res) {
        try {
            const result = await this.concorsoGenericDao.getAllInvaliditaCivileCandidates();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getDSACandidates(req, res) {
        try {
            const result = await this.concorsoGenericDao.getAllDSACandidates();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    getRouter() {
        return this.router;
    }
}

module.exports = ConcorsoGenericController;
