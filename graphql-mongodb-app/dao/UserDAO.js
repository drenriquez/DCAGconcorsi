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
            console.log("-------test getAllUsers--------");
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
    
        console.log("----test getUsersByBirthDate-------",filterDate)
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
        console.log("----test getUserByExactBirthDate5-------", filterDate);
        
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
}

module.exports = UserDAO;