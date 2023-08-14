const {client}=require (`../modules/db.js`);
const bcrypt=require(`bcrypt`);

const SALT_ROUNDS = 3;


async function createTables() {
    await client.query(`CREATE TABLE IF NOT EXISTS steam.games (
                                    ID serial4 NOT NULL ,
                                    game varchar(20),
                                    price int ,
                                    genre varchar (10) ,
                                    PRIMARY KEY (ID) )` );


    await client.query(`CREATE TABLE IF NOT EXISTS steam.users (
                                    ID serial4 NOT NULL ,
                                    name varchar(10),
                                    login varchar (10),
                                    password varchar(100),
                                    wallet int,
                                    role varchar(10),
                                    games_id integer[100] DEFAULT '{}',
                                    wish_list integer[100] DEFAULT '{}',
                                    PRIMARY KEY (ID)  )` );

}


async function getUsers() {
    const users=await client.query(`SELECT * FROM steam.users `);
    return users.rows;
}
async function getUserLogined(log) {
    const users=await client.query(`SELECT * FROM steam.users WHERE login='${log}'`);
    return users.rows[0];
}



async function createGames(){
    await client.query(`SELECT * FROM steam.games`);
    await client.query(`INSERT INTO steam.games (game,price,genre) VALUES ('witcher','20','RPG')`);
    await client.query(`INSERT INTO steam.games (game,price,genre) VALUES ('hades','20','rogue')`);
    await client.query(`INSERT INTO steam.games (game,price,genre) VALUES ('NFS: ubound','60','arcade')`);
}
async function createUser(name,log,pass){
    const users= await getUsers();


    const hashedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const getLogin=users.find(item => item.login===log);
    if(!getLogin) {
        try {
            await client.query(`INSERT INTO steam.users (name, login, password, role) VALUES ('${name}', '${log}', '${hashedPassword}','user')`);
        } catch(err) {
            throw new Error(`Error while register: ${err.message}`);
        }
        return `CREATE USER`;
    }else{
        return 'such a login already exists';
    }
}
async function logIn(log,pass){
    const user=await getUserLogined(log);

    return user.login===log && bcrypt.compare(pass, user.password);
}


async function dep(plus,log){
    let {wallet}=await getUserLogined(log);
    try{
        if(!wallet){
            await client.query(`UPDATE steam.users SET wallet = '${plus}' WHERE login='${log}'` );
        }else {
            await client.query(`UPDATE steam.users SET wallet = wallet + '${plus}' WHERE login='${log}'` );
        }
    }catch(err) {
            throw new Error(`Error while register: ${err.message}`);
        }
        
    return await getUserLogined(log);
}



async function buyGame(log,id){
    try{
        const {games_id,wallet,wish_list}=await getUserLogined(log);

        const {rows: gamesRows}=await client.query(`SELECT * FROM steam.games WHERE ID='${id}'`);
        const {price}=gamesRows[0];

        const gameIndex=wish_list.indexOf(Number(id));
        console.log(gameIndex);

        let change=wallet-price;
        if(change>=0){
            if(!games_id){
                await client.query(`UPDATE steam.users SET games_id = '{${id}}', wallet='${change}' WHERE login='${log}'`);
            }else if(!games_id.includes(Number(id))){
                games_id.push(id);
                await client.query(`UPDATE steam.users SET games_id = '{${games_id}}', wallet='${change}' WHERE login='${log}'`);
            }else{
                console.log( "you already have this game");
            }
            if(gameIndex !== -1){
                wish_list.splice(gameIndex,1);
                await client.query(`UPDATE steam.users SET wish_list = '{${wish_list}}' WHERE login='${log}'`);
            }
        }else{
            console.log("not enough money. top up your account");
        }

    }catch(err) {
        throw new Error(`Error while register: ${err.message}`);
    }

}
async function showMyGame(log){
    try {
        const {games_id} = await getUserLogined(log);
        const {rows: yourGameList} = await client.query(`select * FROM steam.games WHERE ID IN (${games_id})`);
        return yourGameList;
    } catch(err) {
        throw new Error(`Error while register: ${err.message}`);
    }
}

async function addInWishList(log,id){
    try{
        const {games_id,wish_list}=await getUserLogined(log);
        const valueGamesIds=games_id.includes(Number(id));
        const valueWishList=wish_list.includes(Number(id));

        if(valueWishList){
            console.log('this game is already on your wishlist');
        }else if(valueGamesIds){
            console.log('this game is already on your account');
        }else{
            wish_list.push(id);
            await client.query(`UPDATE steam.users SET wish_list = '{${wish_list}}'  WHERE login='${log}'`);
        }
    }catch(err) {
        throw new Error(`Error while register: ${err.message}`);
    }

}
async function showMyWishlist(log){
    try {
        const {wish_list} = await getUserLogined(log);
        const {rows: yourGameList} = await client.query(`select * FROM steam.games WHERE ID IN (${wish_list})`);
        return yourGameList;
    } catch(err) {
        throw new Error(`Error while register: ${err.message}`);
    }
}



module.exports={getUsers,createUser,logIn,dep,createTables,createGames,buyGame,showMyGame,addInWishList,showMyWishlist};



