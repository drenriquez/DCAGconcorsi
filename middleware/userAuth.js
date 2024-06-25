
function userAuth(req, res, next) {
    const isAuthenticated = req.session.isAuthenticated; // Verifica se l'utente è autenticato tramite la sessione

    if (!isAuthenticated) {
        // Se l'utente non è autenticato, reindirizza alla pagina di login
        return res.redirect('/login');
    }

    // Se l'utente è autenticato, passa al middleware successivo
    next();
}


module.exports = {
    userAuth
};
