const express = require('express');
const {logIn,addGame,deleteGame,saleGame,createAdmin,deleteUser} = require("../controllers/adminsController");
const {authAdminMiddleware} = require("../midlewares/midlewareAdmin.js");
const adminsRouter = express.Router();

//сущность Superuser/Admin
//1. добавление игры на площадку, по сути crud +++
//2. выставление временной скидки на игру  +++ ( що таке часова знижка)
//3. crud для юзеров

adminsRouter.post('/login'  , async (req,res)=>{
    const {login,password} = req.body;
    req.session[login]= await logIn(login,password);
    if (req.session[login]){
        res.status(200).send('you are logined');
    }else {
        res.status(403).send(`you are not allowed to login`);
    }
})

adminsRouter.post('/logout', (request, response) => {
    const {login} = request.body;
    request.session[login] = undefined;

    return response.status(200).send('logout')
});

adminsRouter.post('/addGame',authAdminMiddleware, async (request, response) => {
    const {game,price,genre} = request.body;
    response.send(await addGame(game,price,genre));
});

adminsRouter.post('/deleteGame',authAdminMiddleware, async (request, response) => {
    const {game} = request.body;
    response.send(await deleteGame(game));
});

adminsRouter.post('/sale/:percent',authAdminMiddleware, async (request, response) => {
    const {game} = request.body;
    const {percent}= request.params;

    response.send(await saleGame(percent,game));
});

adminsRouter.post('/createAdmin/:userId',authAdminMiddleware, async (request, response) => {
    const {userId}= request.params;
    response.send(await createAdmin(userId));
});

adminsRouter.post('/deleteUser/:userId',authAdminMiddleware, async (request, response) => {
    const {userId}= request.params;
    response.send(await deleteUser(userId));
});

module.exports={adminsRouter};

