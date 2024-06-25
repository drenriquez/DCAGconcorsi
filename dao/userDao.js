const { MongoClient, ObjectId } = require('mongodb');
const databaseConfig = require('../config/database');

class UserDao {
    constructor() {
        this.mongoClient = new MongoClient(databaseConfig.dbURI);
        this.db = null;
        this.usersCollection = null;
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            await this.mongoClient.connect();
            console.log('Connected to MongoDB');
            this.db = this.mongoClient.db(databaseConfig.dbName);
            this.usersCollection = this.db.collection('users');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    async getAllUsers() {
        try {
            return await this.usersCollection.find({}).toArray();
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    }

    async getAllUsersInOrdineCognome() {
        try {
            return await this.usersCollection.find({}).sort({ 'anagrafica.cognome': 1 }).toArray();
        } catch (error) {
            console.error("Error fetching all users ordered by surname:", error);
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            return await this.usersCollection.findOne({ _id: new ObjectId(userId) });
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const result = await this.usersCollection.insertOne(userData);
            return result;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async updateUser(userId, newData) {
        try {
            const result = await this.usersCollection.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: newData },
                { returnOriginal: false }
            );
            return result.value;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const result = await this.usersCollection.findOneAndDelete({ _id: new ObjectId(userId) });
            //console.log("/////////////// inUserDao 77",result)
            return result;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    async getUserByCodiceFiscale(codiceFiscale) {
        try {
            return await this.usersCollection.findOne({ 'anagrafica.codiceFiscale': codiceFiscale });
        } catch (error) {
            console.error("Error fetching user by codice fiscale:", error);
            throw error;
        }
    }

    async getUsersByUfficio(ufficio) {
        try {
            return await this.usersCollection.find({ ufficio: ufficio }).toArray();
        } catch (error) {
            console.error("Error fetching users by ufficio:", error);
            throw error;
        }
    }

    async getLivelloUserByCodiceFiscale(codiceFiscale) {
        try {
            const user = await this.getUserByCodiceFiscale(codiceFiscale);
            return user ? user.livelloUser : null;
        } catch (error) {
            console.error("Error fetching livello user by codice fiscale:", error);
            throw error;
        }
    }

    async getUsersByUffici(uffici) {
        try {
            return await this.usersCollection.find({ ufficio: { $in: uffici } }).sort({ 'anagrafica.cognome': 1 }).toArray();
        } catch (error) {
            console.error("Error fetching users by uffici:", error);
            throw error;
        }
    }

    async addAbsenceByCodiceFiscale(codiceFiscale, data, motivo) {
        try {
            const user = await this.getUserByCodiceFiscale(codiceFiscale);
            if (!user) {
                throw new Error('User not found');
            }

            const date = new Date(data);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const updateQuery = { [`assenze.${year}.${month}.${day}`]: motivo };

            const result = await this.usersCollection.updateOne(
                { 'anagrafica.codiceFiscale': codiceFiscale },
                { $set: updateQuery }
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            return await this.getUserByCodiceFiscale(codiceFiscale);
        } catch (error) {
            console.error("Error adding absence by codice fiscale:", error);
            throw error;
        }
    }

    async deleteAbsenceByCodiceFiscale(codiceFiscale, data) {
        try {
            const user = await this.getUserByCodiceFiscale(codiceFiscale);
            if (!user) {
                throw new Error('User not found');
            }

            const date = new Date(data);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const updateQuery = { $unset: { [`assenze.${year}.${month}.${day}`]: 1 } };

            const result = await this.usersCollection.updateOne(
                { 'anagrafica.codiceFiscale': codiceFiscale },
                updateQuery
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            return await this.getUserByCodiceFiscale(codiceFiscale);
        } catch (error) {
            console.error("Error deleting absence by codice fiscale:", error);
            throw error;
        }
    }

    async addAbsenceById(id, data, motivo) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error('User not found');
            }

            const date = new Date(data);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const updateQuery = { [`assenze.${year}.${month}.${day}`]: motivo };

            const result = await this.usersCollection.updateOne(
                { '_id': new ObjectId(id) },
                { $set: updateQuery }
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            return await this.getUserById(id);
        } catch (error) {
            console.error("Error adding absence by ID:", error);
            throw error;
        }
    }

    async deleteAbsenceById(id, data) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error('User not found');
            }

            const date = new Date(data);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const updateQuery = { $unset: { [`assenze.${year}.${month}.${day}`]: 1 } };

            const result = await this.usersCollection.updateOne(
                { '_id': new ObjectId(id) },
                updateQuery
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            return await this.getUserById(id);
        } catch (error) {
            console.error("Error deleting absence by ID:", error);
            throw error;
        }
    }
}

module.exports = UserDao;
