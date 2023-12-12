const {client}= require (`../modules/db`);

async function filterGames(userGenre){
    try {
        const gamesInThisGenre = await client.query(`SELECT * FROM steam.games WHERE genre='rogue'`);
        return gamesInThisGenre.rows;
    }catch(err) {
        throw new Error(`Error while register: ${err.message}`);
    }
}

async function sortGames(column,sortParam){
    try {
        let sortGames;
        if (sortParam === "low-high") {
            sortGames = await client.query(`SELECT * FROM steam.games ORDER BY ${column}`);
        } else if (sortParam === "high-low") {
            sortGames = await client.query(`SELECT * FROM steam.games ORDER BY ${column} DESC`);
        } else {
            return console.log("not found this sort");
        }

        return sortGames.rows;
    }catch(err) {
        throw new Error(`Error while register: ${err.message}`);
    }
}

module.exports={filterGames,sortGames};
