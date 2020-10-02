// const connection = require('../connection/db');
const mysql = require("mysql");

const sqlQuery = function(){};

let connection;

sqlQuery.setConnection = async({host, user, password, database, connectionLimit}) =>{
    connection  = await mysql.createPool({
        host: host,
        user: user,
        password: password,
        database: database,
        connectionLimit: connectionLimit
    });
}





sqlQuery.queryDB = (query, result) =>{
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

module.exports = sqlQuery;