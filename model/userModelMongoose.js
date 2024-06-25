const mongoose = require('mongoose');

/* // Definizione dello schema per la collezione
const UserSchema = new mongoose.Schema({
    anagrafica: {
        nome: String,
        cognome: String,
        codice_fiscale: String
    },
    amministrazione: String,
    qualifica: String,
    ufficio: String,
    livelloUser: Number,
    assenze: [{
        data: String,
        motivo: String
    }]
}); */

// Definizione degli schemi per le assenze annuali e mensili
const DailyAbsencesSchema = new mongoose.Schema({
    day: String,
    reason: String
}, { _id: false });

const MonthlyAbsencesSchema = new mongoose.Schema({
    month: String,
    days: [DailyAbsencesSchema]
}, { _id: false });

const YearlyAbsencesSchema = new mongoose.Schema({
    year: String,
    months: [MonthlyAbsencesSchema]
}, { _id: false });

// Definizione dello schema per la collezione
const UserSchema = new mongoose.Schema({
    anagrafica: {
        nome: String,
        cognome: String,
        codiceFiscale: String // Modificato in camelCase per coerenza con i dati
    },
    amministrazione: String,
    qualifica: String,
    ufficio: String,
    livelloUser: Number,
    assenze: [YearlyAbsencesSchema]
});

// Creazione del modello e definizione delle operazioni CRUD
const User = mongoose.model('User', UserSchema);

// Metodi per l'accesso ai dati degli utenti
User.getAllUsers = async () => {
    return await User.find({});
};

User.getUserById = async (userId) => {
    return await User.findById(userId);
};

User.createUser = async (userData) => {
    return await User.create(userData);
};

User.updateUser = async (userId, newData) => {
    return await User.findByIdAndUpdate(userId, newData, { new: true });
};

User.deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

// Funzione per trovare un utente per codice fiscale
User.getUserByCodiceFiscale = async (codiceFiscale) => {
    return await User.findOne({ 'anagrafica.codiceFiscale': codiceFiscale });
};

// Funzione per trovare tutti gli utenti di un particolare ufficio
User.getUsersByUfficio = async (ufficio) => {
    return await User.find({ ufficio: ufficio });
};

// Funzione per ottenere il livelloUser tramite codice fiscale
User.getLivelloUserByCodiceFiscale = async (codiceFiscale) => {
    const user = await User.findOne({ 'anagrafica.codiceFiscale': codiceFiscale });
    return user ? user.livelloUser : null;
};

module.exports = User;
