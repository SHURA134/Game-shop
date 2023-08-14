const {client}= require (`../modules/db.js`);
const bcrypt=require(`bcrypt`);

async function getUserLogined(log) {
    const users=await client.query(`SELECT * FROM steam.users WHERE login='${log}'`);
    return users.rows[0];
}
async function getGames() {
    const games=await client.query(`SELECT * FROM steam.games`);
    return games.rows;
}

async function logIn(log,pass){
    const user=await getUserLogined(log);

    return user.login===log && bcrypt.compare(pass, user.password);
}

async function addGame(game,price,genre){
    const games=await getGames();
    const getNameGame=games.find(item => item.game===game);
    if(getNameGame){
        console.log("this game is already on the list ");
    }else{
        await client.query(`INSERT INTO steam.games (game,price,genre) VALUES ('${game}',${price},'${genre}')`);
    }
    return games;

}
async function deleteGame(game){
    const games=await getGames();
    const getNameGame=games.find(item => item.game ===game);
    if(getNameGame){
        await client.query(`DELETE FROM steam.games WHERE game='${game}'`);
    }else{
        console.log("this game is not in the list");
    }
    return games;
}
async function saleGame(percent,game){
    const JsPercent=Number(percent)/100;
    await client.query(`UPDATE steam.games SET price=price * ${JsPercent} WHERE game='${game}'`)
}


async function createAdmin(userId){
    const users=await client.query(`SELECT * FROM steam.users WHERE ID='${userId}'`);
    const {role}=users.rows[0];
    if(role!=="admin"){
        await client.query(`UPDATE steam.users SET role='admin' WHERE ID='${userId}'`)
    }else{
        console.log('this user is already an admin');
    }
}
async function deleteUser(userId){
    const {rows: users}= await client.query(`SELECT * FROM steam.users` );
    const foundId=users.find(item => item.id===Number(userId));
    if(foundId){
        await client.query(`DELETE FROM steam.users WHERE ID='${userId}'`);
    }else{
        console.log('this user is not in the list');
    }
}
module.exports={logIn,addGame,deleteGame,saleGame,createAdmin,deleteUser};