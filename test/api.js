const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();

const mysqlUtil = require("../src/index");


mysqlUtil.setConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 25
});



app.get("/users", async(req, res) =>{
    // USING ***Async/Await keyword ***
    const queryResult = await mysqlUtil.runQuery('select', 'users', req.body, params);
    return res.json({
        queryResult
    });
});


app.get("/products", async(req, res) =>{
    
    let params = {
        where:[
            ['age','!=', 13],
            ['AND', 'gender', 'like', 'male'],
            ['OR', 'id', '=', 1]
        ]
    };

    // ***USING THE .Then keyword***
    mysqlUtil.runQuery('select', 'users', req.body, params).then(data =>{
        return res.json({
            data
        });
    }).catch(err =>{
        return res.json({
            err
        });
    }); 
});

app.post("/user", async(req, res) =>{
    const data = {
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age
    };
    const queryResult = await mysqlUtil.runQuery('insert', 'users', data);
    return res.json({
        queryResult
    });
});

app.post("/product", async(req, res) =>{
    const queryResult = await mysqlUtil.runQuery('insert', req.body, data);
    return res.json({
        queryResult
    });
});

app.put("/users", async(req, res) =>{
    let params = {
        where:[
            ['age','=', 28],
            ['AND', 'gender', 'like', '%male%'],
            ['OR', 'id', '=', 1]
        ]
    };
    
    const queryResult = await mysqlUtil.runQuery('update', 'users', req.body, params);
    return res.json({
        queryResult
    });
});

app.listen(3000, () =>{
    console.log(`Listening on port 3000`);
});