# mysql-query-util

[![Build Status](https://travis-ci.com/uchennaemeruche/mysql-util.svg?token=UzXstzQpgUvQ1wppiktz&branch=master)](https://travis-ci.com/uchennaemeruche/mysql-util)

[![NPM](https://img.shields.io/npm/l/mysql-query-util)](https://github.com/uchennaemeruche/mysql-util)
[![npm](https://img.shields.io/npm/v/mysql-query-util)](https://npmjs.com/package/mysql-query-util)

##### A simple and light-weight utility module for mysql and nodejs.

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
Note: You can either pass positional args or an object to the methods.

```js
const mysqlUtil = require("mysql-query-util");

mysqlUtil.setConnection({
    host: process.env.DB_HOST, //database host, eg: localhost
    user: process.env.DB_USER, // database user, eg: root
    password: process.env.DB_PASSWORD, //database password,eg: anything
    database: process.env.DB_NAME // database name, eg: anything,
    connectionLimit: 25 // connection Limit(Integer)
});

const queryResult = await mysqlUtil.select(tableName, fields, params|Optional);
const queryResult = await mysqlUtil.select({tableName:String, fields:[fieds|columns_to_select], params:[[params|optional]]});

eg: const result = await  mysqlUtil.select("users");
eg: const result = await mysqlUtil.select({tableName:'users'});


```

The above code first initializes a connection before making queries.The initialization happens only once as it creates a connection pool and returns an connection object to be used for subsequent queries.

In the second paragraph, since all the methods return a promise, we await for the promise or use the .then to get the result of the operation.

### Selection query

The package exposes a **.select** method that runs a mysql select query. This method accepts three(3) positional arguments or an object -

```js
// Fetch all record from `users` table
const result = await mysqlUtil.select("users");
// OR
const result = await mysqlUtil.select({ tableName: "users" }).then((res) => {});

// Fetch the name and age from the users table
const result = await mysqlUtil.select("users", ["name", "age"]);
// OR
const result = await mysql.select({
  tableName: "users",
  fields: ["name", "age"],
});

// Fetch all female users whose age is greater that 40
const result = await mysqlUtil.select("users", "*", [
  ["gender", "like", "female"],
  ["AND", "age", ">", 40],
]);
// OR
const result = await mysqlUtil.select({
  tableName: "users",
  fields: ["name", "age"],
  params: [
    ["gender", "like", "female"],
    ["OR", "age", ">", 40],
  ],
}); // To fetch the name and age of all female users that pass a given condition.
```

### Insert Query

Similary, there is a **.insert** method that runs a mysql insert query. This method accepts two(2) positional arguments or an object -

```js
// Insert into `users` table
let data = {
  name: "Foo Bar",
  gender: "female",
  age: 28,
};
const result = await mysqlUtil.insert("users", data); // mysqlUtil.insert({tableName:"users", data}).then((res) => {});

// OR
const result = await mysqlUtil.insert({ tableName: "users", data: data });
```

### Update Query

To run an update, use the **.update** method. This method accepts three arguments(The table, the new data, and the update condition).

```js
// Insert into `users` table
let newData = {
  gender: "male",
};
let updateCondition = [
  ["id", "=", 55],
  ["AND", "age", "=", 28],
];
const result = await mysqlUtil.update("users", newData, updateCondition);
```

OR

```js
const result = await mysqlUtil.update({
  tableName: "users",
  data: newData,
  params: updateCondition,
});
```

### Delete Query

The **.delete** method accepts two arguments- The table name and the delete condition:

```js
let params = [["id", "=", 55]];
const result = mysqlUtil.delete("users", params);
```

OR

```js
const result = mysqlUtil.delete({ tableName: "users", params: params }); // mysqlUtil.delete({ tableName: "users", params });
```

### .query method

The package also exposes a generic **.query** method. See the [test folder on github](https://github.com/uchennaemeruche/mysql-util/tree/master/test) for examples(apis, test) on how to use this method and the ones listed above.

### Handling Raw SQL query

With the **.rawQuery** method, raw sql queries can be executed. Also, this method can be used to call stored procedures.

```js
mysqlUtil
  .rawQuery("CREATE DATABASE IF NOT EXISTS kings_restaurant")
  .then((result) => {
    mysqlUtil.rawQuery(
      "CREATE TABLE IF NOT EXISTS customers(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255), phone VARCHAR(255))"
    );
  });
```

OR

```js
const result = mysqlUtil.rawQuery("select * from customers");

const result = mysqlUtil.rawQuery("call fetchCustomers"); // Where fetchCustomers is the name of a stored procedure.
```

See the [test folder on github](https://github.com/uchennaemeruche/mysql-util/blob/master/test/schema.test.js) for examples on how to use this method.

### License

This project is licensed under the MIT License
