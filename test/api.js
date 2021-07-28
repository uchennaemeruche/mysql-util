/* eslint-disable no-unused-vars */
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const mysqlUtil = require("mysql-crud-util");

mysqlUtil.setConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 25,
});

app.get("/users", async (req, res) => {
  // USING ***Async/Await keyword ***
  const queryResult = await mysqlUtil.query("select", "users");

  const result = await mysqlUtil.select(
    "users",
    ["name", "age"],
    [
      ["age", "!=", 13],
      ["AND", "gender", "like", "male"],
      ["OR", "id", "=", 1],
    ]
  );
  const result2 = await mysqlUtil.select({
    tableName: "users",
    // fields: ["name", "age"],
    params: [
      ["age", "!=", 13],
      ["AND", "gender", "like", "male"],
      ["OR", "id", "=", 1],
    ],
  });
  const result3 = await mysqlUtil.select("users");
  return res.send(result3);
});

app.post("/users", async (req, res) => {
  //   const data = {
  //     name: req.body.name,
  //     gender: req.body.gender,
  //     age: req.body.age,
  //   };
  const data = {
    name: "Udo Emeruche",
    gender: "female",
    age: 28,
  };
  const queryResult = await mysqlUtil.query("insert", "users", data);

  const result = await mysqlUtil.insert("users", data);
  //   const result2 = await mysqlUtil.insert({ tableName: "users", data: data });
  return res.json({ result });
});

app.put("/users", async (req, res) => {
  let params = [["id", "=", 55]];
  const data = {
    gender: "male",
  };

  const queryResult = await mysqlUtil.query(
    "update",
    "users",
    req.body,
    params
  );
  const result = await mysqlUtil.update("users", data, params);
  const queryResult2 = await mysqlUtil.update({
    tableName: "users",
    data,
    params,
  });
  return res.json({
    result,
  });
});

app.delete("/users", async (req, res) => {
  const params = [["id", "=", 39]];
  const queryResult = mysqlUtil.query("delete", "user", params);
  //   const result = mysqlUtil.delete("users", params);
  const result2 = mysqlUtil.delete({ tableName: "users", params });
  return res.json({ result2 });
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
