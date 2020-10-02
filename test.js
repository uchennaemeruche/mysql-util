const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();

const mysqlUtil = require("./index");


mysqlUtil.setConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 25
});



app.get("/users", async(req, res) =>{
    let params = {
        where:[
            ['age','!=', 13],
            ['AND', 'gender', 'like', 'male'],
            ['OR', 'id', '=', 1]
        ]
    };
    const queryResult = await mysqlUtil.runQuery('select', 'users', req.body);
    return res.json({
        queryResult
    });
});

app.listen(3000, () =>{
    console.log("Started on port 3000");
});