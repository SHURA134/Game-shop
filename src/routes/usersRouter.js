const express = require('express');
const {createUser,getUsers,logIn,dep,createTables,buyGame,showMyGame,addInWishList,showMyWishlist} = require("../controllers/usersController");
const {authMiddleware} = require("../midlewares/midlewareSession.js");

const usersRouter = express.Router();

usersRouter.post("/" , async (req,res) => {
    await createTables();
    res.send(await getUsers());
})

usersRouter.post('/registration',async (request, response) => {
    const {name,login,password} = request.body;
    response.send(await createUser(name,login,password));
});

usersRouter.post('/login',async (request, response) => {
    const {login,password} = request.body;
    request.session[login]= await logIn(login,password);
    if (request.session[login]){
        response.status(200).send('you are logined');
    }else {
        response.status(403).send(`you are not allowed to login`);
    }
});

usersRouter.post('/logout', (request, response) => {
    const {login} = request.body;
    request.session[login] = undefined;

    return response.status(200).send('logout')
});

usersRouter.post ('/show', authMiddleware , async (req,res) =>{
    const {login} = req.body;
    res.send(await showMyGame(login));
})

usersRouter.post('/showWishList', authMiddleware , async (req,res) =>{
    const {login} = req.body;

    res.send(await showMyWishlist(login));
})

usersRouter.post('/dep/:deping', authMiddleware , async (req,res) => {
    const {login} = req.body;
    const {deping}= req.params;

    res.send(await dep(deping,login))

})

usersRouter.post('/buy/:gameId', authMiddleware , async (req,res) =>{
    const {gameId}=req.params;
    const {login} = req.body;

    res.send(await buyGame(login,gameId));
})

usersRouter.post('/addWishList/:gameId', authMiddleware , async (req,res) =>{
    const {gameId}=req.params;
    const {login} = req.body;

    res.send(await addInWishList(login,gameId));
})

module.exports={usersRouter};