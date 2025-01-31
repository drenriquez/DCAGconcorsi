const { MongoClient, ObjectId } = require('mongodb');
const databaseConfig = require('../../config/database');

class UserDAO {
    constructor(concorso) {
        this.concorso=concorso;
        this.client = new MongoClient(databaseConfig.dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.db = null;
        this.collection = null;
        //this.initializeDatabase();
        console.log('+++++++++++++++++++++dao Generico ',this.concorso)
    }

    async initializeDatabase() {
        try {
            await this.client.connect();
            console.log(`Connected to MongoDB UserDAO database: ${databaseConfig.dbURI}`);
            this.db = this.client.db(databaseConfig.dbName);
            this.collection = this.db.collection(`${this.concorso}`); // Assumendo che la collezione si chiami '189ILG'
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    // Trova utente per codice fiscale
    async getUserByCf(codiceFiscale) {
        try {
            return await this.collection.findOne({ codiceFiscale });
        } catch (error) {
            console.error('Error fetching user by codice fiscale:', error);
            throw error;
        }
    }

    // Trova tutti gli utenti
    // async getAllUsers() {
    //     try {
    //         console.log("-------test getAllUsers--------")
    //         return await this.collection.find({}).toArray();
    //     } catch (error) {
    //         console.error('Error fetching all users:', error);
    //         throw error;
    //     }
    // }
    async getAllUsers() {
        try {
            //console.log("-------test getAllUsers--------");
            // Applica l'ordinamento per cognome e nome in ordine alfabetico
            return await this.collection.find({})
                .sort({ cognome: 1, nome: 1 }) // 1 indica ordine crescente (alfabetico)
                .toArray();
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }
    // Crea un nuovo utente
    async createUser(user) {
        try {
            const result = await this.collection.insertOne(user);
            return result.ops[0]; // Ritorna il documento inserito
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Cancella utente per ID
    async deleteUser(id) {
        try {
            const result = await this.collection.findOneAndDelete({ _id: new ObjectId(id) });
            return result.value; // Ritorna l'utente cancellato o null se non trovato
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Trova utente per ID
    async getUserById(id) {
        try {
            return await this.collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    }
    async getUsersByBirthDate(filterDate) {
    
        //console.log("----test getUsersByBirthDate-------",filterDate)
        const date = new Date(filterDate);
        
        return await this.collection.find({ dataNascita: { $lt: date.toISOString() } }).toArray();
      }
    // async getUsersByBirthDate(filterDate) {
    //     console.log("----test getUsersByBirthDate2-------", filterDate);
        
    //     // Crea un oggetto Date da filterDate
    //     const date = new Date(filterDate);
        
    //     // Esegui la query per confrontare il campo 'dataNascita.$date'
    //     return await this.collection.find({ "dataNascita.$date": { $lt: date } }).toArray();
    //   }
    
    async getUserByExactBirthDate(filterDate) {
       // console.log("----test getUserByExactBirthDate5-------", filterDate);
        
        // Converti la data fornita in un oggetto Date
        const date = new Date(filterDate);
        
        const results = await this.collection.find({ "dataNascita.$date": { $lt: date } }).toArray();
        
        return results; // Restituisce un array di utenti
      }
      

      async getUsersByBirthDateGreaterThan(filterDate) {
        const date = new Date(filterDate);
        return await this.collection.find({ dataNascita: { $gt: date } }).toArray();
        }
        async getUsersByBirthDateGreaterThanOrEqual(filterDate) {
            const date = new Date(filterDate);
            return await this.collection.find({ dataNascita: { $gte: date } }).toArray();
        }
        async getUsersByBirthDateLessThan(filterDate) {
            const date = new Date(filterDate);
            return await this.collection.find({ dataNascita: { $lt: date } }).toArray();
        }
        async getUsersByBirthDateLessThanOrEqual(filterDate) {
            const date = new Date(filterDate);
            return await this.collection.find({ dataNascita: { $lte: date } }).toArray();
        }
        async getUsersByBirthDateExact(filterDate) {
            const date = new Date(filterDate);
            return await this.collection.find({ dataNascita: date }).toArray();
        }
        async getUsersByBirthDateFilter(after, before){
            const afterDate=new Date(after);
            const beforeDate=new Date(before);
            return await this.collection.find({ dataNascita:{ $gte:afterDate, $lte:beforeDate}}).toArray();
        }
        async getTitoliPreferenziali() {
            try {
                const pipeline = [
                    { 
                        $match: { "domandeConcorso": { $exists: true, $ne: [] } } // Filtra gli utenti con domandeConcorso
                    },
                    { 
                        $project: { 
                            ultimaDomanda: { 
                                $arrayElemAt: ["$domandeConcorso", -1] // Estrae l'ultima domanda
                            }
                        }
                    },
                    { 
                        $unwind: "$ultimaDomanda.lstTitoliPreferenziali" // Scomponi l'array di titoli preferenziali
                    },
                    { 
                        $group: { 
                            _id: "$ultimaDomanda.lstTitoliPreferenziali.descrizione" // Raggruppa per descrizione del titolo
                        }
                    },
                    { 
                        $project: { 
                            _id: 0, 
                            descrizione: "$_id" // Restituisci solo la descrizione
                        }
                    }
                ];
    
                // Esegue la pipeline di aggregazione
                const result = await this.collection.aggregate(pipeline).toArray();
    
                // Restituisce una lista di titoli preferenziali
                return result.map(item => item.descrizione);
            } catch (error) {
                console.error('Error fetching titoli preferenziali:', error);
                throw error;
            }
        }
        async getRiserve() {
            try {
                const pipeline = [
                    { 
                        $match: { "domandeConcorso": { $exists: true, $ne: [] } } // Filtra gli utenti con domandeConcorso
                    },
                    { 
                        $project: { 
                            ultimaDomanda: { 
                                $arrayElemAt: ["$domandeConcorso", -1] // Estrae l'ultima domanda di concorso
                            }
                        }
                    },
                    { 
                        $unwind: "$ultimaDomanda.lstRiserve" // Scomponi l'array delle riserve
                    },
                    { 
                        $group: { 
                            _id: "$ultimaDomanda.lstRiserve.descrizione" // Raggruppa per descrizione della riserva
                        }
                    },
                    { 
                        $project: { 
                            _id: 0, 
                            descrizione: "$_id" // Restituisci solo la descrizione
                        }
                    }
                ];
    
                // Esegue la pipeline di aggregazione
                const result = await this.collection.aggregate(pipeline).toArray();
    
                // Restituisce una lista di riserve
                return result.map(item => item.descrizione);
            } catch (error) {
                console.error('Error fetching riserve:', error);
                throw error;
            }
        }
        // Metodo per recuperare tutte le patenti uniche
    async getPatentiUniche() {
        try {
            const pipeline = [
                {
                    $match: { "domandeConcorso": { $exists: true, $ne: [] } } // Filtra gli utenti che hanno domande di concorso
                },
                {
                    $project: {
                        ultimaDomanda: {
                            $arrayElemAt: ["$domandeConcorso", -1] // Estrae l'ultima domanda di concorso
                        }
                    }
                },
                {
                    $unwind: "$ultimaDomanda.lstPatenti" // Scomponi l'array delle patenti
                },
                {
                    $group: {
                        _id: "$ultimaDomanda.lstPatenti.tipoPatente.tipo" // Raggruppa per il tipo di patente
                    }
                },
                {
                    $project: {
                        _id: 0,
                        tipo: "$_id" // Restituisce solo il tipo di patente
                    }
                }
            ];

            // Esegue la pipeline di aggregazione
            const result = await this.collection.aggregate(pipeline).toArray();

            // Restituisce una lista di tipi di patente
            return result.map(item => item.tipo);
        } catch (error) {
            console.error('Error fetching patenti uniche:', error);
            throw error;
        }
    }
     // Metodo per recuperare tutte le tipologie di prove uniche
     async getTipologieProveUniche() {
        try {
            const pipeline = [
                {
                    $match: { "iterConcorso": { $exists: true, $ne: [] } } // Filtra i documenti con iterConcorso esistente
                },
                {
                    $unwind: "$iterConcorso" // Scomponi l'array iterConcorso per ottenere ogni iter separatamente
                },
                {
                    $match: { "iterConcorso.prova.descrizione": { $exists: true } } // Filtra solo gli iter con descrizione prova
                },
                {
                    $group: {
                        _id: "$iterConcorso.prova.descrizione" // Raggruppa per descrizione della prova per eliminare duplicati
                    }
                },
                {
                    $project: {
                        _id: 0,
                        descrizione: "$_id" // Restituisci solo la descrizione della prova
                    }
                }
            ];

            // Esegui la pipeline di aggregazione
            const result = await this.collection.aggregate(pipeline).toArray();

            // Restituisci le descrizioni delle prove
            return result.map(item => item.descrizione);
        } catch (error) {
            console.error('Error fetching tipologie prove uniche:', error);
            throw error;
        }
    }
    // Metodo per recuperare gli esiti unici in base al tipo di prova
    async getEsitiByProva(tipoProva) {
        try {
            const pipeline = [
                {
                    $match: { "iterConcorso": { $exists: true, $ne: [] } } // Filtra i documenti con iterConcorso esistente
                },
                {
                    $unwind: "$iterConcorso" // Scomponi l'array iterConcorso
                },
                {
                    $match: {
                        "iterConcorso.prova.descrizione": tipoProva, // Filtra per tipoProva
                        "iterConcorso.esito.descrizione": { $exists: true } // Verifica che esista un esito
                    }
                },
                {
                    $group: {
                        _id: "$iterConcorso.esito.descrizione" // Raggruppa per descrizione dell'esito
                    }
                },
                {
                    $project: {
                        _id: 0,
                        esito: "$_id" // Restituisci solo la descrizione dell'esito
                    }
                }
            ];

            // Esegui la pipeline di aggregazione
            const result = await this.collection.aggregate(pipeline).toArray();
            //console.log("///////////////7",result)
            // Restituisci gli esiti
            return result.map(item => item.esito+`|${tipoProva}`);

        } catch (error) {
            console.error('Error fetching esiti by prova:', error);
            throw error;
        }
    }
    // Metodo per recuperare le date delle prove filtrate per tipoProva
 /*    async getDateProveByTipoProva(tipoProva) {
        try {
            const pipeline = [
                {
                    $match: { "iterConcorso": { $exists: true, $ne: [] } } // Filtra documenti con iterConcorso
                },
                {
                    $unwind: "$iterConcorso" // Decompone l'array iterConcorso
                },
                {
                    $match: {
                        "iterConcorso.prova.descrizione": tipoProva, // Filtra per tipoProva
                        "iterConcorso.dataProva": { $exists: true }  // Verifica che esista dataProva
                    }
                },
                {
                    $addFields: {
                        normalizedDate: {
                            // Trasforma il campo dataProva nel formato gestibile
                            $cond: {
                                if: { $eq: [{ $type: "$iterConcorso.dataProva" }, "string"] },
                                then: { $dateFromString: { dateString: "$iterConcorso.dataProva", format: "%Y-%m-%d" } },
                                else: { $toDate: "$iterConcorso.dataProva" }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$normalizedDate" } } // Raggruppa per data formattata
                    }
                },
                {
                    $sort: { _id: 1 } // Ordina le date in ordine crescente
                },
                {
                    $project: {
                        _id: 0,
                        dataProva: "$_id" // Restituisce la data normalizzata
                    }
                }
            ];
    
            // Esegui la pipeline di aggregazione
            const result = await this.collection.aggregate(pipeline).toArray();
    
            // Restituisci la lista delle date
            return result.map(item => item.dataProva);
        } catch (error) {
            console.error('Error fetching date prove by tipoProva:', error);
            throw error;
        }
    } */
    /*     async getDateProveByTipoProva(tipoProva) {
            try {
                const pipeline = [
                    {
                        $match: { "iterConcorso": { $exists: true, $ne: [] } } // Filtra documenti con iterConcorso
                    },
                    {
                        $unwind: "$iterConcorso" // Decompone l'array iterConcorso
                    },
                    {
                        $match: {
                            "iterConcorso.prova.descrizione": tipoProva, // Filtra per tipoProva
                            "iterConcorso.dataProva": { $exists: true }  // Verifica che esista dataProva
                        }
                    },
                    {
                        $group: {
                            _id: "$iterConcorso.dataProva" // Raggruppa per la data esattamente com'è
                        }
                    },
                    {
                        $sort: { _id: 1 } // Ordina le date in ordine crescente
                    },
                    {
                        $project: {
                            _id: 0,
                            dataProva: "$_id" // Restituisce la data com'è nel database
                        }
                    }
                ];
        
                // Esegui la pipeline di aggregazione
                const result = await this.collection.aggregate(pipeline).toArray();
        
                // Restituisci la lista delle date
                return result.map(item => item.dataProva);
            } catch (error) {
                console.error('Error fetching date prove by tipoProva:', error);
                throw error;
            }
        } */
    async getDateProveByTipoProva(tipoProva) {
        try {
            const pipeline = [
                {
                    $match: { "iterConcorso": { $exists: true, $ne: [] } } // Filtra documenti con iterConcorso
                },
                {
                    $unwind: "$iterConcorso" // Decompone l'array iterConcorso
                },
                {
                    $match: {
                        "iterConcorso.prova.descrizione": tipoProva, // Filtra per tipoProva
                        "iterConcorso.dataProva": { $exists: true }  // Verifica che esista dataProva
                    }
                },
                {
                    $group: {
                        _id: "$iterConcorso.dataProva" // Raggruppa per la dataProva
                    }
                },
                {
                    $sort: { _id: 1 } // Ordina le date in ordine crescente
                }
            ];
    
            // Esegui la pipeline di aggregazione
            const result = await this.collection.aggregate(pipeline).toArray();
    
            // Normalizza la data controllando che sia una stringa valida e convertendola in oggetto Date
            return result.map(item => {
                let valA = item._id; // La data restituita dal database
    
                // Verifica se valA è una stringa valida e convertibile in una data
                if (typeof valA === 'string' && !isNaN(Date.parse(valA))) {
                    valA = new Date(valA); // Converte in oggetto Date
                }
    
                // Verifica se valA è effettivamente un oggetto Date e può chiamare toISOString()
                if (valA instanceof Date && !isNaN(valA)) {
                    let valB= valA.toISOString().split(':00.')[0];//.split('T')[0]; // Restituisce la parte della data (YYYY-MM-DD)
                    let dataAndTipoProva=valB+`|${tipoProva}`
                    return dataAndTipoProva
                } else {
                    // Se la conversione non è possibile, restituisce il valore così com'è
                    return valA;
                }
            });
        } catch (error) {
            console.error('Error fetching date prove by tipoProva:', error);
            throw error;
        }
    }
            
    // Metodo per ottenere candidati in base ai criteri specificati
    /**
     * Trova i candidati in base ai criteri di ricerca passati
     * @param {Array} riserve - Lista delle riserve da cercare
     * @param {Array} titoliPreferenziali - Lista dei titoli preferenziali
     * @param {Array} patenti - Lista delle patenti
     * @param {Array} statoCandidato - Lista degli stati candidato
     * @returns {Array} candidati che soddisfano i criteri
     */
    /* async getCandidatiByCriteria({ 
        riserve, 
        titoliPreferenziali, 
        patenti,
        tipoProve,
        esitiProve, 
        dateProve,     
        statoCandidato,
        nome, 
        cognome, 
        codiceFiscale,
        BirthDateGreaterThanOrEqual,
        BirthDateLessThanOrEqual
    }) {
        const query = {};
    
        // Aggiungi il filtro per lo stato del candidato
        if (statoCandidato && statoCandidato.length > 0) {
            query.statoCandidato = { $in: statoCandidato };
        }
    
        // Aggiungi il filtro per le riserve (deve essere soddisfatta una delle riserve specificate)
        if (riserve && riserve.length > 0) {
            query["domandeConcorso.lstRiserve.descrizione"] = { $in: riserve };
        }
    
        // Aggiungi il filtro per i titoli preferenziali (deve essere soddisfatto uno dei titoli preferenziali specificati)
        if (titoliPreferenziali && titoliPreferenziali.length > 0) {
            query["domandeConcorso.lstTitoliPreferenziali.descrizione"] = { $in: titoliPreferenziali };
        }
    
        // Aggiungi il filtro per le patenti (deve essere soddisfatta una delle patenti specificate)
        if (patenti && patenti.length > 0) {
            query["domandeConcorso.lstPatenti.tipoPatente.tipo"] = { $in: patenti };
        }
    
        // Aggiungi il filtro per il tipo di prove (deve essere presente una delle prove specificate)
        if (tipoProve && tipoProve.length > 0) {
            query["iterConcorso.prova.descrizione"] = { $in: tipoProve };
        }
    
        // Aggiungi il filtro per il nome
        if (nome && nome.length > 0) {
            query.nome = { $regex: new RegExp(nome, "i") }; // Ricerca case-insensitive con regex
        }
    
        // Aggiungi il filtro per il cognome
        if (cognome && cognome.length > 0) {
            query.cognome = { $regex: new RegExp(cognome, "i") }; // Ricerca case-insensitive con regex
        }
    
        // Aggiungi il filtro per il codice fiscale
        if (codiceFiscale && codiceFiscale.length > 0) {
            query.codiceFiscale = { $regex: new RegExp(codiceFiscale, "i") }; // Ricerca case-insensitive con regex
        }
    
        // Aggiungi il filtro per la data di nascita maggiore o uguale
        if (BirthDateGreaterThanOrEqual) {
            const birthDate = new Date(BirthDateGreaterThanOrEqual);
            query.dataNascita = { ...query.dataNascita, $gte: birthDate };
        }
    
        // Aggiungi il filtro per la data di nascita minore o uguale
        if (BirthDateLessThanOrEqual) {
            const birthDate = new Date(BirthDateLessThanOrEqual);
            query.dataNascita = { ...query.dataNascita, $lte: birthDate };
        }
    
        // Aggiungi il filtro per esitiProve
        if (esitiProve && esitiProve.length > 0) {
            const esitiProveConditions = esitiProve.map(esitoProva => {
                const [esito, prova] = esitoProva.split("|"); // Divide la stringa in esito e prova
                return {
                    "iterConcorso": {
                        $elemMatch: {
                            "esito.descrizione": esito.trim(),
                            "prova.descrizione": prova.trim()
                        }
                    }
                };
            });
    
            // Aggiungiamo le condizioni esito come un $and (deve essere soddisfatto almeno uno degli esiti per ogni prova)
            if (!query.$and) {
                query.$and = [];
            }
            query.$and.push({
                $or: esitiProveConditions
            });
        }
    
        // Aggiungi il filtro per dateProve
        if (dateProve && dateProve.length > 0) {
            const dateProveConditions = dateProve.map(dateProva => {
                const [data, prova] = dateProva.split("|");
                let formattedData = data + ":00.000+00:00"; // Aggiungi la parte mancante della data
                return {
                    "iterConcorso": {
                        $elemMatch: {
                            "prova.descrizione": prova.trim(),
                            "dataProva": new Date(formattedData.trim()) // Data formattata correttamente
                        }
                    }
                };
            });
    
            // Aggiungi le condizioni $or per le date all'interno di $and
            if (!query.$and) {
                query.$and = [];
            }
            
            // Aggiungi il filtro come $or, deve soddisfare almeno una delle date specifiche per la prova
            query.$and.push({
                $or: dateProveConditions
            });
        }
    
        try {
            console.log(JSON.stringify(query))
            const candidati = await this.collection.find(query).toArray();
            
            // Modifica l'array domandeConcorso per includere solo l'ultima domanda
            const candidatiModificati = candidati.map(candidato => {
                if (candidato.domandeConcorso && candidato.domandeConcorso.length > 0) {
                    // Mantieni solo l'ultima domanda
                    candidato.domandeConcorso = [candidato.domandeConcorso[candidato.domandeConcorso.length - 1]];
                }
                return candidato;
            });
    
            return candidatiModificati;
        } catch (error) {
            console.error('Error fetching candidates by criteria:', error);
            throw error;
        }
    } */
        async getCandidatiByCriteria({ 
            riserve, 
            titoliPreferenziali, 
            patenti,
            tipoProve,
            esitiProve, 
            dateProve,     
            statoCandidato,
            nome, 
            cognome, 
            codiceFiscale,
            BirthDateGreaterThanOrEqual,
            BirthDateLessThanOrEqual
        }) {
            const query = {};
        
            // Aggiungi i filtri (identici a prima)
            if (statoCandidato && statoCandidato.length > 0) {
                query.statoCandidato = { $in: statoCandidato };
            }
        
            if (riserve && riserve.length > 0) {
                query["domandeConcorso.lstRiserve.descrizione"] = { $in: riserve };
            }
        
            if (titoliPreferenziali && titoliPreferenziali.length > 0) {
                query["domandeConcorso.lstTitoliPreferenziali.descrizione"] = { $in: titoliPreferenziali };
            }
        
            if (patenti && patenti.length > 0) {
                query["domandeConcorso.lstPatenti.tipoPatente.tipo"] = { $in: patenti };
            }
        
            if (tipoProve && tipoProve.length > 0) {
                query["iterConcorso.prova.descrizione"] = { $in: tipoProve };
            }
        
            if (nome && nome.length > 0) {
                query.nome = { $regex: new RegExp(nome, "i") };
            }
        
            if (cognome && cognome.length > 0) {
                query.cognome = { $regex: new RegExp(cognome, "i") };
            }
        
            if (codiceFiscale && codiceFiscale.length > 0) {
                query.codiceFiscale = { $regex: new RegExp(codiceFiscale, "i") };
            }
        
            if (BirthDateGreaterThanOrEqual) {
                const birthDate = new Date(BirthDateGreaterThanOrEqual);
                query.dataNascita = { ...query.dataNascita, $gte: birthDate };
            }
        
            if (BirthDateLessThanOrEqual) {
                const birthDate = new Date(BirthDateLessThanOrEqual);
                query.dataNascita = { ...query.dataNascita, $lte: birthDate };
            }
        
            if (esitiProve && esitiProve.length > 0) {
                const esitiProveConditions = esitiProve.map(esitoProva => {
                    const [esito, prova] = esitoProva.split("|");
                    return {
                        "iterConcorso": {
                            $elemMatch: {
                                "esito.descrizione": esito.trim(),
                                "prova.descrizione": prova.trim()
                            }
                        }
                    };
                });
                if (!query.$and) query.$and = [];
                query.$and.push({ $or: esitiProveConditions });
            }
        
            if (dateProve && dateProve.length > 0) {
                const dateProveConditions = dateProve.map(dateProva => {
                    const [data, prova] = dateProva.split("|");
                    const formattedData = data + ":00.000+00:00";
                    return {
                        "iterConcorso": {
                            $elemMatch: {
                                "prova.descrizione": prova.trim(),
                                "dataProva": new Date(formattedData.trim())
                            }
                        }
                    };
                });
                if (!query.$and) query.$and = [];
                query.$and.push({ $or: dateProveConditions });
            }
        
            try {
                //console.log(JSON.stringify(query));
                
                const candidati = await this.collection
                    .aggregate([
                        { $match: query }, // Filtra i documenti
                        { $sort: { 
                            cognome: 1,         // Ordina per cognome (ascendente)
                            nome: 1,            // Ordina per nome (ascendente)
                            dataNascita: 1      // Ordina per dataNascita (ascendente)
                        }}
                    ])
                    .toArray();
        
                // Modifica l'array domandeConcorso per includere solo l'ultima domanda
                const candidatiModificati = candidati.map(candidato => {
                    if (candidato.domandeConcorso && candidato.domandeConcorso.length > 0) {
                        candidato.domandeConcorso = [candidato.domandeConcorso[candidato.domandeConcorso.length - 1]];
                    }
                    return candidato;
                });
        
                return candidatiModificati;
            } catch (error) {
                console.error('Error fetching candidates by criteria:', error);
                throw error;
            }
        }
        
        /**
     * Metodo per ottenere tutti i possibili campi in una collezione MongoDB
     */
        async getAllFields() {
            try {
                const allFields = new Set();
        
                // Recupera tutti i documenti della collezione
                const cursor = this.collection.find({});
        
                // Itera su ogni documento nella collezione
                await cursor.forEach(doc => {
                    extractFields(doc, '', allFields); // Funzione per estrarre campi anche nidificati
                });
        
                // Converti il Set in array e restituisci i campi
                let result =Array.from(allFields);
                result.unshift("_id")
               
                return result
            } catch (error) {
                console.error('Error fetching fields:', error);
                throw error;
            }
        }
        async getSimpleFields() {
            try {
               
                const simpleFields = new Set();
        
                // Recupera tutti i documenti della collezione
                const cursor = this.collection.find({});
        
                // Itera su ogni documento nella collezione
                await cursor.forEach(doc => {
                    extractSimpleFields(doc, '', simpleFields); // Funzione per estrarre solo i campi semplici
                });
        
                // Converti il Set in array e restituisci i campi semplici
                let result =Array.from(simpleFields);
                result.unshift("_id")
                let resultSenzaIter = result.filter(item => item !== "iterConcorso");

               
                return resultSenzaIter
                
            } catch (error) {
                console.error('Error fetching simple fields:', error);
                throw error;
            }
        }
        // Nuovo metodo per ottenere i campi dell'ultimo oggetto in domandeConcorso per tutta la collezione
    async getAllCampiDomandeConcorso() {
        try {
            const campi = new Set();

            // Troviamo tutti i documenti nella collezione
            const documents = await this.collection.find({}).toArray();

            // Funzione ricorsiva per estrarre i campi da un oggetto
            const estraiCampi = (obj, prefix = '') => {
                Object.keys(obj).forEach(key => {
                    const fullKey = prefix ? `${prefix}.${key}` : key;

                    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                        estraiCampi(obj[key], fullKey); // Se il campo è un oggetto, continuiamo la ricorsione
                    } else {
                        campi.add(fullKey); // Aggiungiamo il campo alla lista dei campi
                    }
                });
            };

            // Iteriamo su ogni documento
            documents.forEach(document => {
                if (document.domandeConcorso && document.domandeConcorso.length > 0) {
                    // Prendiamo l'ultimo oggetto dall'array domandeConcorso
                    const ultimoOggetto = document.domandeConcorso[document.domandeConcorso.length - 1];

                    // Eseguiamo la funzione estraiCampi sull'ultimo oggetto
                    estraiCampi(ultimoOggetto);
                }
            });

            // Restituiamo l'insieme dei campi come array
            //console.log("*****getAllCampiDomandeConcorso: ",Array.from(campi))
            return Array.from(campi);

        } catch (error) {
            console.error('Errore durante l\'estrazione dei campi da domandeConcorso:', error);
            throw error;
        }
    }
    async getStepsByProvaByCandidato(codiceFiscale, descrizioneProva) {
        
        try {

            const pipeline = [
                {
                    $match: {
                        "domandeConcorso.anagCandidato.codiceFiscale": codiceFiscale
                    }
                },
                {
                    $unwind: "$iterConcorso"
                },
                {
                    $match: {
                        "iterConcorso.prova.descrizione": descrizioneProva
                    }
                },
                {
                    $project: {
                        _id: 0,
                        idStep:{ $ifNull: ["$iterConcorso.idStep", "ID_NON_PRESENTE"] },  // Se il campo iterConcorso.idStep è nullo o mancante, sostituiscilo con "ID_NON_PRESENTE"
                        dataProva: "$iterConcorso.dataProva",
                        prova:"$iterConcorso.prova",
                        esito: "$iterConcorso.esito",
                        punteggio: "$iterConcorso.punteggio",
                        cFTipoProva:"$iterConcorso.cFTipoProva",
                        cFTipoEsito:"$iterConcorso.cFTipoEsito",
                        note: "$iterConcorso.note",
                        assenzaGiustificata: "$iterConcorso.assenzaGiustificata",
                    }
                }
            ];
           // console.log("----------Pipeline:", JSON.stringify(pipeline)); // Log della pipeline

            const steps = await this.collection.aggregate(pipeline).toArray();
            return steps;
        } catch (error) {
            console.error("Error fetching steps:", error);
            throw error;
        } finally {
            await this.client.close();
        }
    }

     //considera l'ultimo step per dataProva
   /*  async getDocumentsByProvaWithEsito(provaDescrizione, esitoList) {
        console.log("------------ DAO getDocumentsByProvaWithEsito -----------");
        try {
            if (!this.collection) {
                throw new Error("Database not initialized. Call initializeDatabase first.");
            }
    
            const pipeline = [
                // Filtro iniziale per i documenti che contengono almeno un iterConcorso con la prova specifica
                {
                    $match: {
                        "iterConcorso.prova.descrizione": provaDescrizione
                    }
                },
    
                // Espandi l'array iterConcorso
                { $unwind: "$iterConcorso" },
    
                // Filtra gli iterConcorso che corrispondono alla descrizione della prova
                {
                    $match: {
                        "iterConcorso.prova.descrizione": provaDescrizione
                    }
                },
    
                // Ordina per _id e dataProva per ogni documento
                { $sort: { "_id": 1, "iterConcorso.dataProva": 1 } },
    
                // Raggruppa per documento principale (_id), mantenendo solo l'ultimo step della prova specifica
                {
                    $group: {
                        _id: "$_id",
                        codiceFiscale: { $first: "$codiceFiscale" },
                        nome: { $first: "$nome" },
                        cognome: { $first: "$cognome" },
                        ultimoStep: { $last: "$iterConcorso" }
                    }
                },
    
                // Filtra i documenti in base all'esito dell'ultimo step
                {
                    $match: {
                        "ultimoStep.esito.descrizione": { $in: esitoList }
                    }
                },
                
                    //ordina secondo la dataProva
                    { $sort: { "ultimoStep.dataProva": 1 } },
                // Proietta i campi desiderati
                {
                    $project: {
                        _id: 1,
                        codiceFiscale: 1,
                        nome: 1,
                        cognome: 1,
                        "ultimoStep.prova.descrizione": 1,
                        "ultimoStep.esito.descrizione": 1,
                        "ultimoStep.dataProva": 1,
                        "ultimoStep.assenzaGiustificata.dataInizioMalattia": 1,
                        "ultimoStep.assenzaGiustificata.giorniCertificati": 1
                    }
                }
            ];
    
            const results = await this.collection.aggregate(pipeline).toArray();
            console.log("----", results, "-----");
            return results;
        } catch (error) {
            console.error("Error fetching documents by prova and esito:", error);
            throw error;
        }
    } */


        //considera l'ultimo step per idStep
        async getDocumentsByProvaWithEsito(provaDescrizione, esitoList) {
            //console.log("------------ DAO getDocumentsByProvaWithEsito -----------");
            try {
                if (!this.collection) {
                    throw new Error("Database not initialized. Call initializeDatabase first.");
                }
        
                const pipeline = [
                    // Filtro iniziale per i documenti che contengono almeno un iterConcorso con la prova specifica
                    {
                        $match: {
                            "iterConcorso.prova.descrizione": provaDescrizione
                        }
                    },
        
                    // Espandi l'array iterConcorso
                    { $unwind: "$iterConcorso" },
        
                    // Filtra gli iterConcorso che corrispondono alla descrizione della prova
                    {
                        $match: {
                            "iterConcorso.prova.descrizione": provaDescrizione
                        }
                    },
        
                    // Ordina per _id e idStep per ogni documento
                    { $sort: { "_id": 1, "iterConcorso.idStep": 1 } },
        
                    // Raggruppa per documento principale (_id), mantenendo solo l'ultimo step della prova specifica
                    {
                        $group: {
                            _id: "$_id",
                            codiceFiscale: { $first: "$codiceFiscale" },
                            nome: { $first: "$nome" },
                            cognome: { $first: "$cognome" },
                            ultimoStep: { $last: "$iterConcorso" }
                        }
                    },
        
                    // Filtra i documenti in base all'esito dell'ultimo step
                    {
                        $match: {
                            "ultimoStep.esito.descrizione": { $in: esitoList }
                        }
                    },
        
                    //ordina secondo la dataProva
                    { $sort: { "ultimoStep.dataProva": 1 } },
                    // Proietta i campi desiderati
                    {
                        $project: {
                            _id: 1,
                            codiceFiscale: 1,
                            nome: 1,
                            cognome: 1,
                            "ultimoStep.prova.descrizione": 1,
                            "ultimoStep.esito.descrizione": 1,
                            "ultimoStep.idStep": 1,
                            "ultimoStep.dataProva": 1,
                            "ultimoStep.assenzaGiustificata.dataInizioMalattia": 1,
                            "ultimoStep.assenzaGiustificata.giorniCertificati": 1
                        }
                    }
                ];
        
                const results = await this.collection.aggregate(pipeline).toArray();
                //console.log("----", results, "-----");
                return results;
            } catch (error) {
                console.error("Error fetching documents by prova and esito:", error);
                throw error;
            }
        }


/* -------------------------------------------------------------------------------------------------

                          MUTATION - mutation
------------------------------------------------------------------------------------------------------*/
        // Aggiungi o aggiorna uno step
        async addOrUpdateStep(codiceFiscale, provaDescrizione, idStep, stepData) {
            console.log('******* Chiamata funzione addOrUpdateStep nel DAO');
        
            try {
                // Trova il documento con il codice fiscale specifico
                const user = await this.collection.findOne({ codiceFiscale });
                if (!user) {
                    throw new Error(`User with codiceFiscale ${codiceFiscale} not found`);
                }
        
                // Trova l'oggetto iterConcorso corrispondente alla provaDescrizione
                const iterConcorsoIndex = user.iterConcorso.findIndex(
                    (step) => step.prova.descrizione === provaDescrizione && step.idStep === idStep
                );
        
                // Creiamo una copia di stepData per evitare modifiche indesiderate
                let updatedStepData = { ...stepData };
        
                // ✅ Convertiamo la data in un oggetto Date prima di salvare
                if (updatedStepData.dataProva && typeof updatedStepData.dataProva === "string") {
                    const parsedDate = new Date(updatedStepData.dataProva);
                    if (!isNaN(parsedDate)) {
                        updatedStepData.dataProva = parsedDate; // MongoDB la salverà come Date
                    } else {
                        console.warn("⚠️ Warning: dataProva non è una data valida", updatedStepData.dataProva);
                        updatedStepData.dataProva = null; // Evita di salvare un valore errato
                    }
                }
        
                console.log("✅ Dati da salvare:", updatedStepData);
        
                if (iterConcorsoIndex >= 0) {
                    // Aggiornamento dello step esistente
                    const updateQuery = {
                        $set: {
                            [`iterConcorso.${iterConcorsoIndex}`]: {
                                ...user.iterConcorso[iterConcorsoIndex],
                                ...updatedStepData,
                            },
                        },
                    };
        
                    const result = await this.collection.updateOne({ codiceFiscale }, updateQuery);
                    console.log('✅ Risultato aggiornamento:', result);
                    return result.modifiedCount > 0;
                } else {
                    // Nuovo step da aggiungere
                    const pushQuery = {
                        $push: {
                            iterConcorso: {
                                idStep,
                                ...updatedStepData,
                            },
                        },
                    };
        
                    const result = await this.collection.updateOne({ codiceFiscale }, pushQuery);
                    console.log('✅ Risultato inserimento:', result);
                    return result.modifiedCount > 0;
                }
            } catch (error) {
                console.error('❌ Errore in addOrUpdateStep:', error);
                throw error;
            }
        }
        
    }
    
  /**
 * Funzione per estrarre tutti i campi di un documento, inclusi quelli nidificati
 * @param {Object} doc - Il documento corrente
 * @param {String} prefix - Prefisso per i campi nidificati
 * @param {Set} allFields - L'insieme che contiene i campi unici
 */
function extractFields(doc, prefix, allFields) {
    Object.keys(doc).forEach(key => {
        // Ignora i campi _id.buffer e i suoi sotto-campi
        if (key === '_id' || key.startsWith('_id.buffer')) return;

        const fieldPath = prefix ? `${prefix}.${key}` : key; // Gestisce campi nidificati
        allFields.add(fieldPath);

        // Se il campo è un oggetto, iteriamo ricorsivamente
        if (typeof doc[key] === 'object' && doc[key] !== null) {
            if (Array.isArray(doc[key])) {
                // Gestisci specificamente domandeConcorso
                if (key === 'domandeConcorso' && doc[key].length > 0) {
                    // Prendi solo il primo elemento dell'array di domandeConcorso
                    const firstDomanda = doc[key][0];
                    extractFields(firstDomanda, `${prefix}.domandeConcorso`, allFields);
                } else if (key === 'iterConcorso') {
                    // Esplodi tutti i campi di iterConcorso (manteniamo la gestione iterConcorso)
                    doc[key].forEach((item, index) => {
                        extractFields(item, `${fieldPath}[${index}]`, allFields);
                    });
                }
            } else {
                // Oggetti nidificati: continua a estrarre i campi
                extractFields(doc[key], fieldPath, allFields);
            }
        }
    });
}
/**
 * Funzione per estrarre solo i campi semplici (non nidificati)
 * @param {Object} doc - Il documento corrente
 * @param {String} prefix - Prefisso per i campi nidificati
 * @param {Set} simpleFields - L'insieme che contiene i campi semplici
 */
function extractSimpleFields(doc, prefix, simpleFields) {
    Object.keys(doc).forEach(key => {
        // Ignora solo i campi che iniziano con '_id.buffer', ma NON il semplice '_id'
        if (key.startsWith('_id.buffer')) return;

        const fieldPath = prefix ? `${prefix}.${key}` : key;

        // Se il campo è un oggetto o un array, ignoralo
        if (typeof doc[key] === 'object' && doc[key] !== null) {
            // Se è un array o un oggetto, non aggiungerlo
           
            return;
        }

        // Aggiunge solo i campi semplici (primitivi) che non sono oggetti o array
        simpleFields.add(fieldPath);
    });
}
module.exports = UserDAO;