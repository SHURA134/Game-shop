const express = require ('express');
const bodyParser = require('body-parser');
const {usersRouter}= require('./routes/usersRouter.js');
const {gamesRouter}= require('./routes/gamesRouter.js');
const {adminsRouter}= require('./routes/adminsRouter.js');
const session = require('express-session');

const app=express();
const port=3001;

app.use(bodyParser.json());

app.use(session({
    secret : `secret`,
    name: `session`
}));

app.use('/users',usersRouter);
app.use('/games',gamesRouter);
app.use('/admins',adminsRouter);

app.listen(port, () =>{
    console.log(`app has started on port ${port}`);
})

