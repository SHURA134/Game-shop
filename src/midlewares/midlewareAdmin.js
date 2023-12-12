const {client}= require (`../modules/db`);

async function authAdminMiddleware(request, response, next) {
    try {
        const login = request.body.login;
        const arrRoles = await client.query(`SELECT role FROM steam.users WHERE login='${login}'`);
        const {role} = arrRoles.rows[0];
        if (!login) {
            return response.status(403).send('you must pass login param');
        }

        if (!request.session[login]) {
            return response.status(401).send('unathorized, please login first');
        }

        if (role !== "admin") {
            return response.status(401).send('you do not have admin status');
        }

        next();
    }catch(err) {
        throw new Error(`Error database: ${err.message}`);
    }
}

module.exports = { authAdminMiddleware };