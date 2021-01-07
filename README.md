# mysql-query-util

[![Build Status](https://travis-ci.com/uchennaemeruche/mysql-util.svg?token=UzXstzQpgUvQ1wppiktz&branch=master)](https://travis-ci.com/uchennaemeruche/mysql-util)
A simple and light-weight utility module for mysql and nodejs.

This plugin helps construct mysql queries with more relatable syntax just like most non-sql database management systems. It is a [NodeJs](https://nodejs.org/en) module available through the npm registry so be sure to [download and install NodeJS](https://nodejs.org/en/download) first.

---

## Installation

```bash
npm install --save mysql-query-util
```

## Features

The plugin abstracts most redundant mysql CRUD queries from the developer by providing an easier and more declarative way of constructing queries for:

- [Selecting](#Selecting)
- [Insertion](#Insertion)
- [Update](#Update)
- [Delete](#Delete)

### Configuration and usage

Here is an example of how to use the plugin:

```js
const mysqlUtil = require("mysql-query-util");

mysqlUtil.setConnection({
    host: process.env.DB_HOST, //database host, eg: localhost
    user: process.env.DB_USER, // database user, eg: root
    password: process.env.DB_PASSWORD, //database password,eg: anything
    database: process.env.DB_NAME // database name, eg: anything,
    connectionLimit: 25 // connection Limit(Integer)
});

const queryResult = await mysqlUtil.select({tableName, [fieds|columns_to_select], [params|optional]});
eg: const result = await mysqlUtil.select({tableName:'users'})


```

The above code first initializes a connection before making queries.The initialization happens only once as it creates a connection pool and returns an object to be used for subsequent queries.

In the second paragraph, since all the methods returns promises, we await for the promise or use the .then to get the result of the operation.

### Selection query

```js
const result = await mysqlUtil.select({ tableName: "users" }); // To fetch all records from `users` table and return all fields.
OR;
mysqlUtil.select({ tableName: "users" }).then((res) => {});
OR;
const result = await mysqlUtil.select({
  tableName: "users",
  params: ["name", "age"],
}); // To fetch the name and age from the users table.
OR;
const result = await mysqlUtil.select({
  tableName: "users",
  params: ["name", "age"],
  params: {
    where: [
      ["age", "!=", 13],
      ["AND", "gender", "like", "male"],
      ["OR", "id", "=", 1],
    ],
  },
}); // To fetch the name and age from the users table that matches a given condition.
```

### Examples
