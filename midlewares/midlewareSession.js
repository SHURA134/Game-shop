function authMiddleware(request, response, next) {
    const login = request.body.login;
    console.log("REQUETS", login);
    if (!login) {
        return response.status(403).send('you must pass login param');
    }

   if (!request.session[login]) {
        return response.status(401).send('unathorized, please login first');
    }



    next();
}

module.exports = { authMiddleware };

