const { MongoClient, ObjectId } = require('mongodb');
const databaseConfig = require('../config/database');

class ConcorsiEsterniCollectionDao {
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
            console.log(`Connected to MongoDB concorsiEsterni database ${databaseConfig.dbURI}`);
            this.db = this.mongoClient.db(databaseConfig.dbName);
            this.candidatiCollection = this.db.collection('concorsiEsterni'); 
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
    
}

module.exports = ConcorsiEsterniCollectionDao;