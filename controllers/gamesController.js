const {client}= require (`../modules/db.js`);

async function filterGames(userGenre){
    console.log("ya tut");
    const gamesInThisGenre= await client.query(`SELECT * FROM steam.games WHERE genre='rogue'` );
    return gamesInThisGenre.rows;
}


async function sortGames(column,sortParam){
    let sortGames;
    if(sortParam==="low-high"){
        sortGames= await client.query(`SELECT * FROM steam.games ORDER BY ${column}`);
    }else if(sortParam==="high-low"){
        sortGames= await client.query(`SELECT * FROM steam.games ORDER BY ${column} DESC`);
    }else{
        return console.log("not found this sort");
    }
    return sortGames.rows;
}

module.exports={filterGames,sortGames};
