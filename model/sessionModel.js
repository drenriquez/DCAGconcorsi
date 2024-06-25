const { MongoClient, ObjectId } = require('mongodb');
const databaseConfig = require('../config/database');

class SessionModel {
    constructor() {
        this.mongoClient = new MongoClient(databaseConfig.dbURI);
        this.db = null;
        this.sessionsCollection = null;
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            await this.mongoClient.connect();
            console.log('Connected to MongoDB');
            this.db = this.mongoClient.db(databaseConfig.dbName);
            this.sessionsCollection = this.db.collection('sessions');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    async getAllSessions() {
        try {
            return await this.sessionsCollection.find({}).toArray();
        } catch (error) {
            console.error("Error fetching all sessions:", error);
            throw error;
        }
    }
    async getSessionByIdBoolean(sessionId) {
        try {
            const session = await this.sessionsCollection.findOne({ _id: sessionId });
            return !!session;
        } catch (error) {
            console.error("Error fetching session by ID:", error);
            throw error;
        }
    }
    
    async getSessionById(sessionId) {
        try {
            return await this.sessionsCollection.findOne({ _id: new ObjectId(sessionId) });
        } catch (error) {
            console.error("Error fetching session by ID:", error);
            throw error;
        }
    }

    async createSession(sessionData) {
        try {
            const result = await this.sessionsCollection.insertOne(sessionData);
            return result.ops[0];
        } catch (error) {
            console.error("Error creating session:", error);
            throw error;
        }
    }

    async updateSession(sessionId, newData) {
        try {
            const result = await this.sessionsCollection.findOneAndUpdate(
                { _id: new ObjectId(sessionId) },
                { $set: newData },
                { returnOriginal: false }
            );
            return result.value;
        } catch (error) {
            console.error("Error updating session:", error);
            throw error;
        }
    }

    async deleteSession(sessionId) {
        try {
            const result = await this.sessionsCollection.findOneAndDelete({ _id: new ObjectId(sessionId) });
            return result.value;
        } catch (error) {
            console.error("Error deleting session:", error);
            throw error;
        }
    }

    async getSessionByUser(userId) {
        try {
            return await this.sessionsCollection.findOne({ 'session.user': userId });
        } catch (error) {
            console.error("Error fetching session by user ID:", error);
            throw error;
        }
    }
}

module.exports = SessionModel