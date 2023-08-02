const {Client} = require('pg');
const client = new Client({
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    db: process.env.POSTGRES_DB
})

client.connect();

module.exports={client};