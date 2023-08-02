const express = require('express');
const {createUser,getUsers,logIn,dep} = require("../controllers/usersController");
const {authMiddleware} = require("../midlewares/midlewareSession.js");
const usersRouter = express.Router();

/*usersRouter.post("/", authMiddleware , async (req,res) => {
    res.send('bez session');
})

 */

usersRouter.post("/", authMiddleware , async (req,res) => {
    //const name=req.body.name;

    //console.log( await createUser(name,log,password));
    //console.log(await getUsers());
})

usersRouter.post('/autorization',async (request, response) => {
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

usersRouter.post('/:deping',async (req,res) => {
    const {login} = req.body;
    const {deping}= req.params;
    if (req.session[login]){
        res.send(await dep(deping,login))
        console.log('ya tut');
    }else {
        res.status(403).send(`you are not allowed to login`);
    }
})



module.exports={usersRouter};