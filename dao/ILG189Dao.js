const { MongoClient, ObjectId } = require('mongodb');
const databaseConfig = require('../config/database');

class ILG189Dao {
    constructor() {
        this.mongoClient = new MongoClient(databaseConfig.dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.db = null;
        this.candidatiCollection = null;
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            await this.mongoClient.connect();
            console.log(`Connected to MongoDB ILG189Dao database ${databaseConfig.dbURI}`);
            this.db = this.mongoClient.db(databaseConfig.dbName);
            this.candidatiCollection = this.db.collection('189ILG'); 
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    async findAll() {
        try {
            return await this.candidatiCollection.find({}).toArray();
        } catch (error) {
            console.error('Error fetching all candidati:', error);
            throw error;
        }
    }

    async findByCodiceFiscale(codiceFiscale) {
        try {
            return await this.candidatiCollection.findOne({ codiceFiscale: codiceFiscale });
        } catch (error) {
            console.error('Error fetching candidato by codice fiscale:', error);
            throw error;
        }
    }
    async findByCodiceFiscaleList(codiciFiscali) {
        try {
           
            if (!Array.isArray(codiciFiscali)) {
                throw new Error("Parameter 'codiciFiscali' must be an array.");
            }
    
            return await this.candidatiCollection.find({ codiceFiscale: { $in: codiciFiscali } }).toArray();
        } catch (error) {
            console.error('Error fetching candidati by codice fiscale list:', error);
            throw error;
        }
    }
    

    async create(candidatoData) {
        try {
            const result = await this.candidatiCollection.insertOne(candidatoData);
            return result.ops[0];
        } catch (error) {
            console.error('Error creating candidato:', error);
            throw error;
        }
    }

    async updateById(id, updateData) {
        try {
            const result = await this.candidatiCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnOriginal: false }
            );
            return result.value;
        } catch (error) {
            console.error('Error updating candidato:', error);
            throw error;
        }
    }

    async deleteById(id) {
        try {
            const result = await this.candidatiCollection.findOneAndDelete({ _id: new ObjectId(id) });
            return result.value;
        } catch (error) {
            console.error('Error deleting candidato:', error);
            throw error;
        }
    }
    async deleteByCodiceFiscale(cf) {
        try {
            const result = await this.candidatiCollection.findOneAndDelete({ codiceFiscale: cf });
            return result.value;
        } catch (error) {
            console.error('Error deleting candidato:', error);
            throw error;
        }
    }

    async findByCognome(cognome) {
        try {
            return await this.candidatiCollection.find({ cognome: cognome }).toArray();
        } catch (error) {
            console.error('Error fetching candidati by cognome:', error);
            throw error;
        }
    }
    //"statoCandidato": { "$ne": "AMMESSO" }
    async findNotAmmessi() {
        try {
            return await this.candidatiCollection.find({"statoCandidato": { "$ne": "AMMESSO" }}).toArray();
        } catch (error) {
            console.error('Error fetching all candidati:', error);
            throw error;
        }
    }
    // async findRecapitiByCodiceFiscaleList(codiciFiscali = null) {
    //     try {
    //         let query = {};
    //         if (codiciFiscali && codiciFiscali.length > 0) {
    //             query = { codiceFiscale: { $in: codiciFiscali } };
    //         }
    //         return await this.candidatiCollection.find(
    //             query,
    //             {
    //                 projection: {
    //                     codiceFiscale: 1,
    //                     cognome: 1,
    //                     nome: 1,
    //                     dataNascita: 1,
    //                     'comuneNascita.nome': 1,
    //                     'domandeConcorso.anagCandidato.residenza': 1,
    //                     'domandeConcorso.anagCandidato.pec': 1
    //                 }
    //             }
    //         ).sort({ cognome: 1, nome: 1 }).toArray(); // Aggiunta opzione di ordinamento;
    //     } catch (error) {
    //         console.error('Error fetching details by codice fiscale list:', error);
    //         throw error;
    //     }
    // }
    async findRecapitiByCodiceFiscaleList(codiciFiscali = null) {
        try {
            let matchStage = {};
            if (codiciFiscali && codiciFiscali.length > 0) {
                matchStage = { codiceFiscale: { $in: codiciFiscali } };
            }
    
            const pipeline = [
                { $match: matchStage },
                { 
                    $unwind: {
                        path: "$domandeConcorso",
                        preserveNullAndEmptyArrays: true
                    }
                },
                { 
                    $sort: { 
                        "codiceFiscale": 1, 
                        "domandeConcorso.infoInvio.data": -1 
                    }
                },
                { 
                    $group: {
                        _id: "$codiceFiscale",
                        codiceFiscale: { $first: "$codiceFiscale" },
                        cognome: { $first: "$cognome" },
                        nome: { $first: "$nome" },
                        dataNascita: { $first: "$dataNascita" },
                        comuneNascita: { $first: "$comuneNascita" },
                        residenza: { $first: "$domandeConcorso.anagCandidato.residenza" },
                        pec: { $first: "$domandeConcorso.anagCandidato.pec" }
                    }
                },
                { 
                    $sort: { 
                        cognome: 1, 
                        nome: 1 
                    }
                },
                {
                    $project: {
                        _id: 0,
                        codiceFiscale: 1,
                        cognome: 1,
                        nome: 1,
                        dataNascita: 1,
                        "comuneNascita.nome": 1,
                        residenza: 1,
                        pec: 1
                    }
                }
            ];
    
            return await this.candidatiCollection.aggregate(pipeline).toArray();
        } catch (error) {
            console.error('Error fetching details by codice fiscale list:', error);
            throw error;
        }
    }
    async updateRecapitiByCodiceFiscaleList(candidatiUpdateList) {
        try {
            const bulkOps = [];
    
            for (const candidato of candidatiUpdateList) {
                const { codiceFiscale, residenza, pec } = candidato;
    
                // Find the document with the most recent domandeConcorso entry
                const existingCandidato = await this.candidatiCollection.findOne({ codiceFiscale });
    
                if (existingCandidato) {
                    const recentDomanda = existingCandidato.domandeConcorso.reduce((latest, current) => {
                        return new Date(latest.infoInvio.data) > new Date(current.infoInvio.data) ? latest : current;
                    });
    
                    bulkOps.push({
                        updateOne: {
                            filter: { codiceFiscale },
                            update: {
                                $set: {
                                    "domandeConcorso.$[elem].anagCandidato.residenza": residenza,
                                    "domandeConcorso.$[elem].anagCandidato.pec": pec
                                }
                            },
                            arrayFilters: [
                                { "elem.infoInvio.data": recentDomanda.infoInvio.data }
                            ]
                        }
                    });
                }
            }
    
            if (bulkOps.length > 0) {
                return await this.candidatiCollection.bulkWrite(bulkOps);
            } else {
                return { message: "No valid updates found." };
            }
        } catch (error) {
            console.error('Error updating candidati by codice fiscale list:', error);
            throw error;
        }
    }
    async findByIdStep(idStep) {
        try {
            const pipeline = [
                { $unwind: "$iterConcorso" },
                { $match: { "iterConcorso.idStep": idStep } },
                { $sort: { "iterConcorso.punteggio": 1 } },
                { $project: {
                    codiceFiscale: 1,
                    cognome: 1,
                    nome: 1,
                    dataNascita: 1,
                    comuneNascita: 1,
                    residenza: 1,
                    pec: 1,
                    iterConcorso: 1
                }}
            ];
    
            return await this.candidatiCollection.aggregate(pipeline).toArray();
        } catch (error) {
            console.error('Error fetching candidati by idStep:', error);
            throw error;
        }
    }
    async updateIterConcorsoByCodiciFiscali(codiciFiscaliUpdates) {
        try {
            for (const [codiceFiscale, update] of Object.entries(codiciFiscaliUpdates)) {
                const candidato = await this.candidatiCollection.findOne({ codiceFiscale: codiceFiscale });
                if (!candidato) {
                    console.warn(`Candidato con codice fiscale ${codiceFiscale} non trovato`);
                    continue;
                }
    
                let updated = false;
                for (let iter of candidato.iterConcorso) {
                    if (iter.idStep === update.idStep) {
                        Object.assign(iter, update);
                        updated = true;
                        break;
                    }
                }
    
                if (!updated) {
                    candidato.iterConcorso.push(update);
                }
    
                await this.candidatiCollection.updateOne(
                    { codiceFiscale: codiceFiscale },
                    { $set: { iterConcorso: candidato.iterConcorso } }
                );
            }
    
            return { success: true };
        } catch (error) {
            console.error('Error updating iter concorso by codici fiscali:', error);
            throw error;
        }
    }
    async findCandidatiByNomeCognome(nome, cognome) {
        try {
            const candidati = await this.candidatiCollection.find({ nome: nome, cognome: cognome }).toArray();
            return candidati;
        } catch (error) {
            console.error('Error fetching candidati by nome and cognome:', error);
            throw error;
        }
    }
    async countCandidati() {
        try {
            const count = await this.candidatiCollection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting candidati:', error);
            throw error;
        }
    }
    
}

module.exports = ILG189Dao;

