const mysql = require("mysql");

let connection;

async function setConnection({host, user, password, database, connectionLimit}){
    connection  = await mysql.createPool({
        host: host,
        user: user,
        password: password,
        database: database,
        connectionLimit: connectionLimit
    });
}


function queryDb(query, result){
    let getConnectionFromPool = function(){
        connection.query(query, (err, res) =>{
            if(err){
                if(err.code == "ECONNREFUSED"){
                    console.log("Connection Refused: ", err.code);
                    getConnectionFromPool();
                    return;
                }
                // console.log("An Error occured")
                // console.log(err);
                result(err, null);
                return;
            }
            if(res){
                console.log("Query Result successful: ");
                result(null, res);
                return;
            }
        });
    }
    getConnectionFromPool();
}

module.exports = queryDb, setConnection;