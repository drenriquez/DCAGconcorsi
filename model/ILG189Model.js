const { ObjectId } = require('mongodb');

class ILG189Model {
    constructor({
        _id = null,
        codiceFiscale,
        cognome,
        nome,
        dataNascita,
        comuneNascita,
        elaborato,
        statoDomanda,
        statoCandidato,
        dataUltInvioDomanda,
        annullaDomanda = null,
        domandeConcorso = [],
        iterConcorso = []
    }) {
        this._id = _id ? new ObjectId(_id) : null;
        this.codiceFiscale = codiceFiscale;
        this.cognome = cognome;
        this.nome = nome;
        this.dataNascita = dataNascita ? new Date(dataNascita) : null;
        this.comuneNascita = comuneNascita;
        this.elaborato = elaborato;
        this.statoDomanda = statoDomanda;
        this.statoCandidato = statoCandidato;
        this.dataUltInvioDomanda = dataUltInvioDomanda ? new Date(dataUltInvioDomanda) : null;
        this.annullaDomanda = annullaDomanda;
        this.domandeConcorso = domandeConcorso;
        this.iterConcorso = iterConcorso;
    }

    // Getters
    getId() {
        return this._id;
    }

    getCodiceFiscale() {
        return this.codiceFiscale;
    }

    getCognome() {
        return this.cognome;
    }

    getNome() {
        return this.nome;
    }

    getDataNascita() {
        return this.dataNascita;
    }

    getComuneNascita() {
        return this.comuneNascita;
    }

    getElaborato() {
        return this.elaborato;
    }

    getStatoDomanda() {
        return this.statoDomanda;
    }

    getStatoCandidato() {
        return this.statoCandidato;
    }

    getDataUltInvioDomanda() {
        return this.dataUltInvioDomanda;
    }

    getAnnullaDomanda() {
        return this.annullaDomanda;
    }

    getDomandeConcorso() {
        return this.domandeConcorso;
    }

    getIterConcorso() {
        return this.iterConcorso;
    }

    // Setters
    setId(id) {
        this._id = new ObjectId(id);
    }

    setCodiceFiscale(codiceFiscale) {
        this.codiceFiscale = codiceFiscale;
    }

    setCognome(cognome) {
        this.cognome = cognome;
    }

    setNome(nome) {
        this.nome = nome;
    }

    setDataNascita(dataNascita) {
        this.dataNascita = new Date(dataNascita);
    }

    setComuneNascita(comuneNascita) {
        this.comuneNascita = comuneNascita;
    }

    setElaborato(elaborato) {
        this.elaborato = elaborato;
    }

    setStatoDomanda(statoDomanda) {
        this.statoDomanda = statoDomanda;
    }

    setStatoCandidato(statoCandidato) {
        this.statoCandidato = statoCandidato;
    }

    setDataUltInvioDomanda(dataUltInvioDomanda) {
        this.dataUltInvioDomanda = new Date(dataUltInvioDomanda);
    }

    setAnnullaDomanda(annullaDomanda) {
        this.annullaDomanda = annullaDomanda;
    }

    setDomandeConcorso(domandeConcorso) {
        this.domandeConcorso = domandeConcorso;
    }

    setIterConcorso(iterConcorso) {
        this.iterConcorso = iterConcorso;
    }

    // Utility methods
    getFullName() {
        return `${this.nome} ${this.cognome}`;
    }

    addDomandaConcorso(domanda) {
        this.domandeConcorso.push(domanda);
    }

    removeDomandaConcorso(index) {
        if (index >= 0 && index < this.domandeConcorso.length) {
            this.domandeConcorso.splice(index, 1);
        }
    }

    addIterConcorso(step) {
        this.iterConcorso.push(step);
    }

    removeIterConcorso(index) {
        if (index >= 0 && index < this.iterConcorso.length) {
            this.iterConcorso.splice(index, 1);
        }
    }
}

module.exports = ILG189Model;
