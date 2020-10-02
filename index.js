const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();

const sqlQuery = require('./models/query.model');

app.use(express.json());
app.use(express.urlencoded());

sqlQuery.setConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 25
});

function checkParamType(data){
    if(typeof data == 'string') return `'${data}'`;
    else return `${data}`;
}

function matchQueryFilters(query, params){
    let counter = 0;
    params.where[0].unshift("");
    for(param in params.where){
        query +=  `${params.where[param][1]} ${ params.where[param][2]} ` + checkParamType(params.where[param][3]);
        counter ++;
        if(counter < params.where.length){
            query += ` ${params.where[counter][0]} `;
        }  
    }
    return query;
}


function constructQuery(queryKeyword, tableName, requestBody, params = null){
    const keyWords = {
        SELECT: 'select',
        UPDATE: 'update',
        DELETE: 'delete',
        INSERT: 'insert'
    };

    let query = ``;

    if (queryKeyword == keyWords.SELECT){
        let counter = 0;
        if(params == null)
            query = `SELECT * FROM ${tableName}`;
        else{
            query = `SELECT * FROM ${tableName} WHERE `;
            query = matchQueryFilters(query, params);
        }
    }else if(queryKeyword == keyWords.UPDATE){
        query = `UPDATE ${tableName} SET `;
        let fieldLength = Object.entries(requestBody).length;
        let counter = 0;
        for(field in requestBody){
            query += (`${field} = ` + checkParamType(requestBody[field]));
            counter ++;
            if(counter < fieldLength) 
                query += `, `;
        }
        counter = 0;
        query += ` WHERE `;

        query = matchQueryFilters(query, params);

    }else if(queryKeyword == keyWords.INSERT){
        let fieldLength = Object.entries(requestBody).length;
        let counter = 0;

        query = `INSERT INTO ${tableName} (`;
        for(field in requestBody){
            query += (`${field}`)
            counter ++;
            if(counter < fieldLength) 
                query += `, `;
            else{
                query += `) VALUES(`;
                counter = 0;
                for(value in requestBody){
                    query +=    checkParamType(requestBody[value]);
                    counter ++;
                    if(counter < fieldLength){
                        query += `, `;
                    }else{
                        query += `)`;
                    }
                }
            }
               
        }
    }else if(queryKeyword == keyWords.DELETE){
        if(params == null)
            query = `DELETE FROM ${tableName}`;
        else{
            query = `DELETE FROM ${tableName} WHERE `;

            query = matchQueryFilters(query, params)
        }
    }
    return query;
}   

function runCode(queryType, tableName, requestBody, params) {

    let query = constructQuery(queryType, tableName, requestBody, params);
    return new Promise((resolve, reject) => {

    try{
        sqlQuery.queryDB(query, (err, result) =>{
            if(err){
                resolve(err);
            }
            else{
                resolve(result);
            }
        });
    }catch(e){
        resolve(err.message);
    }
    });
  }


app.listen(3000, () =>{
    console.log(`Listening on port 3000`);
});