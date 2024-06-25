class UserModel {
    constructor({ _id = null, anagrafica, amministrazione, qualifica, ufficio, livelloUser, assenze }) {
        this._id = _id; // L'id viene passato come argomento
        this.anagrafica = anagrafica;
        this.amministrazione = amministrazione;
        this.qualifica = qualifica;
        this.ufficio = ufficio;
        this.livelloUser = livelloUser;
        this.assenze = assenze;
    }

    // Rimuovi il metodo setId, poiché l'id viene passato direttamente nel costruttore

    // Aggiungi un metodo getId per ottenere l'id
    getId() {
        return this._id;
    }

    getAnagrafica() {
        return this.anagrafica;
    }

    getNome() {
        return this.anagrafica.nome;
    }

    getCognome() {
        return this.anagrafica.cognome;
    }

    getCodiceFiscale() {
        return this.anagrafica.codiceFiscale;
    }

    getAmministrazione() {
        return this.amministrazione;
    }

    getQualifica() {
        return this.qualifica;
    }

    getUfficio() {
        return this.ufficio;
    }

    getLivelloUser() {
        return this.livelloUser;
    }

    getAssenze() {
        return this.assenze;
    }

    // Setters
    setId(id) {
        this._id = new ObjectId(id);
    }

    setAnagrafica(anagrafica) {
        this.anagrafica = anagrafica;
    }

    setNome(nome) {
        this.anagrafica.nome = nome;
    }

    setCognome(cognome) {
        this.anagrafica.cognome = cognome;
    }

    setCodiceFiscale(codiceFiscale) {
        this.anagrafica.codiceFiscale = codiceFiscale;
    }

    setAmministrazione(amministrazione) {
        this.amministrazione = amministrazione;
    }

    setQualifica(qualifica) {
        this.qualifica = qualifica;
    }

    setUfficio(ufficio) {
        this.ufficio = ufficio;
    }

    setLivelloUser(livelloUser) {
        this.livelloUser = livelloUser;
    }

    setAssenze(assenze) {
        this.assenze = assenze;
    }

    // Utility methods
    getFullName() {
        return `${this.anagrafica.nome} ${this.anagrafica.cognome}`;
    }

    addAbsence(date, motivo) {
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        if (!this.assenze[year]) {
            this.assenze[year] = {};
        }
        if (!this.assenze[year][month]) {
            this.assenze[year][month] = {};
        }
        this.assenze[year][month][day] = motivo;
    }

    removeAbsence(date) {
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        if (this.assenze[year] && this.assenze[year][month]) {
            delete this.assenze[year][month][day];
        }
    }
}

export { UserModel };
    // const { ObjectId } = require('mongodb');

// class UserModel {
//     constructor({
//         _id = null,
//         anagrafica = {},
//         amministrazione = '',
//         qualifica = '',
//         ufficio = '',
//         livelloUser = 0,
//         assenze = {}
//     }) {
//         this._id = _id ? new ObjectId(_id) : null;
//         this.anagrafica = anagrafica;
//         this.amministrazione = amministrazione;
//         this.qualifica = qualifica;
//         this.ufficio = ufficio;
//         this.livelloUser = livelloUser;
//         this.assenze = assenze;
//     }