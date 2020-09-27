
const express = require('express');
const app = express();

const sqlQuery = require('./models/query.model');

app.use(express.json());
app.use(express.urlencoded());


app.get("/users", async(req, res) =>{
    // const query = `SELECT * FROM users`;
    // const queryResult = await runCode(query);

    const queryResult = await runCode('select', 'users', req.body, {"age" : 30});
    return res.json({
        queryResult
    });
    
    
});

app.post("/user", async(req, res) =>{
    const queryResult = await runCode('insert', 'users', req.body, '');
    console.log(queryResult);
    return res.json({
        queryResult
    });
});

app.put("/users", async(req, res) =>{
    params = {
        "age": 28,
        "gender": "female"
    };
    
    const queryResult = await runCode('update', 'users', req.body, params, 'AND');
    
    console.log(queryResult);
    return res.json({
        queryResult
    });
});


async function runQuery(query){
    try{
        await sqlQuery.queryDB(query, (err, result) =>{
            if(err){
                console.log("There is an error");
                return err;
            }
            else{
                console.log("There is a result", result);
                return {
                    message:"success",
                    data: result
                };
            }
        });
    }catch(e){
        res.status(400).send({
            error: e.message
        })
    }
}

function checkParamType(data){
    if(typeof data == 'string') return `'${data}'`;
    else return `${data}`;
}


function constructQuery(queryKeyword, tableName, requestBody, params = null, operator = 'AND'){
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
            query = `SELECT * FROM ${tableName} WHERE `
            for(param in params){
                query += `${param} = ` + checkParamType(params[param]);
                counter ++;
                if(counter < Object.entries(params).length){
                    query += ` ${operator} `;
                }
            }
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
        // query += ` WHERE ${params.name} = ${params.value} `
        query += ` WHERE `;

        for(param in params){
            query += `${param} = ` + checkParamType(params[param]);
            counter ++;
            if(counter < Object.entries(params).length){
                query += ` ${operator} `;
            }
        }

        console.log("Update Query: ", query);

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
    }
    return query;
}   

function runCode(queryKeyword, tableName, requestBody, params, operator) {

    query = constructQuery(queryKeyword, tableName, requestBody, params, operator);
    console.log("starting fast promise")
    return new Promise((resolve, reject) => {

    try{
        sqlQuery.queryDB(query, (err, result) =>{
            if(err){
                console.log("There is an error");
                resolve(err);
            }
            else{
                console.log("There is a result", result);
                resolve(result);
            }
        });
    }catch(e){
        resolve(err.message);
    }
    })
  }





// function runCode(query) {
//     console.log("starting fast promise")
//     return new Promise((resolve, reject) => {

//     try{
//         sqlQuery.queryDB(query, (err, result) =>{
//             if(err){
//                 // console.log("There is an error");
//                 resolve(err);
//             }
//             else{
//                 console.log("There is a result", result);
//                 resolve(result);
//             }
//         });
//     }catch(e){
//         resolve(err.message);
//     }
//     })
//   }


app.listen(3000, () =>{
    console.log(`Listening on port 3000`);
});