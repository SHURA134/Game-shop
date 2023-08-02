const express= require(`express`);
const bodyParser = require('body-parser');
const {usersRouter}= require('./routes/usersRouter.js');
const session = require('express-session');
const app=express();

const port=3001;

app.use(bodyParser.json());
app.use(session({
    secret : `secret`,
    name: `session`
}));
app.use('/users',usersRouter);


app.listen(port, () =>{
    console.log(`app has started on port ${port}`);
})

