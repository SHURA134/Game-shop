const {client}=require (`../modules/db.js`);

async function getUsers() {
    const users=await client.query(`SELECT * FROM steam.users `);
    return users.rows;
}

async function createUser(name,log,pass){
    const users= await getUsers();
    if(users.find(item => item.login===log)=== undefined) {
        const user = await client.query(`INSERT INTO steam.users (name,login,password,wallet) VALUES('${name}','${log}','${pass}','200')`);
        return `CREATE USER`;
    }else{
        return 'such a login already exists';
    }
}

async function logIn(log,pass){

    const user=await getUsers();
    const findLogin=user.find(item => item.login === log && item.password === pass);

    if (findLogin !== undefined) {
        return true;
    } else {
        return undefined;
    }
}

async function dep(plus,login){
    await client.query(`UPDATE steam.users SET wallet = wallet+'${plus}' WHERE login='${login}'` );
    return getUsers();
}


module.exports={getUsers,createUser,logIn,dep};



