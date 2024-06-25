const SessionModel=require('../model/sessionModel');
const sessionModel= new SessionModel();
function getSessionId(rawHeaders) {
    // Trova l'indice dell'elemento che inizia con 'connect.sid='
    const cookieIndex = rawHeaders.findIndex(header => header.startsWith('Cookie'));
  
    if (cookieIndex !== -1) {
        // Estrai il valore del cookie
        const cookieValue = rawHeaders[cookieIndex + 1];
  
        // Trova l'indice della sottostringa 's%3A'
        const startIndex = cookieValue.indexOf('s%3A');
        // Trova l'indice del primo punto dopo 's%3A'
        const dotIndex = cookieValue.indexOf('.', startIndex);
  
        // Se sia startIndex che dotIndex sono validi
        if (startIndex !== -1 && dotIndex !== -1) {
            // Estrai la parte dell'ID della sessione
            const sessionId = cookieValue.substring(startIndex + 4, dotIndex);
            return sessionId.toString();
        }
    }
  
    return null; // Se non viene trovato il cookie o l'ID della sessione
}
async function userApiAuth (req, res, next) {
    try {
        //console.log('--------  API auth middleware --------');
        
        // Verifica se la richiesta è per la pagina di login e non eseguire la verifica della sessione in quel caso
        if (req.path === '/login') {
            return next();
        }

        const idSession = getSessionId(req.rawHeaders);
        const isSessionOk = await sessionModel.getSessionByIdBoolean(idSession);

        if (!isSessionOk) {
            // Se la sessione non è valida e la richiesta non è per la pagina di login, reindirizza alla pagina di login
            console.log("----------------Sessione non Trovata (middlware userApiAuth) NON AUTORIZZATO --------------");
            return res.redirect('/login');
        }

        // Se la sessione è valida, passa il controllo alla prossima funzione nella catena di gestione delle richieste
        next();
    } catch (error) {
        console.error("Errore durante l'autenticazione dell'API:", error);
        res.status(500).send("Errore durante l'autenticazione dell'API");
    }
};
module.exports = {
    userApiAuth
};