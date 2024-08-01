const { MongoClient, ObjectId } = require('mongodb');
const databaseConfig = require('../config/database');

class DatabaseDao {
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

    async getCollectionNames() {
        try {
            const collections = await this.db.listCollections().toArray();
            return collections.map(collection => collection.name);
        } catch (error) {
            console.error('Error fetching collection names:', error);
            throw error;
        }
    }
    
}

module.exports = DatabaseDao;
