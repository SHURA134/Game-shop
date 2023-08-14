const express = require('express');
const {sortGames,filterGames} = require("../controllers/gamesController");

const gamesRouter = express.Router();

gamesRouter.post("/genre", async (req,res)=>{
    const {genre}=req.params;
    res.send(await filterGames(genre));
})

gamesRouter.post("/price/:sortParam", async (req,res)=>{
    const {sortParam}=req.params;
    res.send(await sortGames("price", sortParam));
})
gamesRouter.post("/:sortParam", async (req,res)=>{
    const {sortParam}=req.params;
    res.send(await sortGames("game", sortParam));
})

module.exports={gamesRouter};