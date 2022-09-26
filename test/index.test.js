const dotenv = require("dotenv");
const expect = require("chai").expect;
dotenv.config();
const faker = require("faker");
const mysqlUtil = require("../src/index");

const updateBody = {
  gender: "male",
};

const reqBody = {
  name: faker.name.firstName() + " " + faker.name.lastName(),
  age: Number(faker.datatype.number(100).toString().slice(0, 2)),
  gender: faker.name.gender() == "Man" ? "Male" : "Female",
};
const reqBody2 = {
  name: faker.name.firstName() + " " + faker.name.lastName(),
  age: Number(faker.datatype.number(100).toString().slice(0, 2)),
  gender: faker.name.gender() == "Man" ? "Male" : "Female",
};

const testQueries = [

  {
    input: ["delete", "users"],
    description: "Should delete all records from the users table",
    expects:  function(result){
          expect(result).to.not.be.an('error')
          expect(result).to.be.an("object");
          expect(result).to.include.keys(
            "fieldCount",
            "affectedRows",
            "insertId",
            "serverStatus",
            "warningStatus"
          );
        }
     
  },
  {
    input: ["insert", "users", "", reqBody, ""],
    description: "should insert a new user and return result",
    expects: function(result){
          expect(result).to.not.be.an('error')
          expect(result).to.be.an("object");
          expect(result).to.include.keys(
            "fieldCount",
            "affectedRows",
            "insertId",
            "serverStatus",
            "warningStatus"
          );
          expect(result.affectedRows).to.equal(1);
          expect(result.insertId).to.greaterThanOrEqual(1);
        }
  },

  {
    description: "Should return all columns and rows in the user table",
    input: ["select", "users"],
    expects: function(result){
      expect(result).to.not.be.an('error')
      expect(result).to.be.an("array");
      expect(result).length.to.be.greaterThanOrEqual(1);
      expect(result[0]).to.include.keys("id", "name", "age", "gender");
    }
  },
  {
    description:
      "Should return the name and age of specific users whose ID > 1",
    input: ["select", "users", ["name", "age"], "", [["id", ">", 1]]],
    expects: function(result){
      expect(result).to.not.be.an('error')
      expect(result).to.be.an("array");
      expect(result).length.to.be.greaterThanOrEqual(0);
      if(result.length > 0){
        expect(result[0]).to.include.keys("name", "age");
      }
    }
  },
  {
    description: "Should return all male users above 40 years",
    input: [
      "select",
      "users",
      "*",
      "",
      [
        ["gender", "like", "male"],
        ["AND", "age", ">", 40],
      ],
    ],
    expects: function(result){
      expect(result).to.not.be.an('error')
      expect(result).to.be.an("array");
      expect(result).length.to.be.greaterThanOrEqual(0);
      if(result.length >= 1){
        expect(result[0]).to.include.keys("id","name", "gender", "age");
        expect(result[0].age).to.be.greaterThanOrEqual(40);
      }
    }
  },

  {
    input: ["delete", "users", "_", "", [["id", "=", "50"]]],
    description: "should delete all users whose age is 50",
    expects:  function(result){
      expect(result).to.not.be.an('error')
      expect(result).to.be.an("object");
      expect(result).to.include.keys(
        "fieldCount",
        "affectedRows",
        "insertId",
        "serverStatus",
        "warningStatus"
      );
    }
  },
  {
    input: ["update", "users", "", updateBody, [["id", "=", "51"]]],
    description: "should update gender of user with id:52",
    expects:  function(result){
      expect(result).to.not.be.an('error')
      expect(result).to.be.an("object");
      expect(result).to.include.keys(
        "fieldCount",
        "affectedRows",
        "insertId",
        "serverStatus",
        "warningStatus",
        "changedRows"
      );
    }
  },
  {
    input: ["insert", "users", "", reqBody2, ""],
    description: "should insert a new user and return result",
    expects: function(result){
      expect(result).to.not.be.an('error')
        expect(result).to.be.an("object");
        expect(result).to.include.keys(
          "fieldCount",
          "affectedRows",
          "insertId",
          "serverStatus",
        );
        expect(result.affectedRows).to.equal(1);
        expect(result.insertId).to.greaterThanOrEqual(1);
    }
  },
];

beforeEach(function () {
  mysqlUtil.setConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 25,
  });
});

describe("#test-queries()", () => {
  const dbName = 'db_tests'

  before(function () {
    mysqlUtil.setConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionLimit: 25,
    });
  });
  it("creates a new database when passed a raw query", async() => {
    const result = await mysqlUtil
      .rawQuery(`CREATE DATABASE IF NOT EXISTS ${dbName}`)

      expect(result).to.not.be.an('error')
      expect(result).to.be.an("object");
      expect(result).to.include.keys(
        "fieldCount",
        "affectedRows",
        "insertId",
        "serverStatus",
      );
      
  });

  it("creates a new table inside the database", async() => {
    const result = await mysqlUtil
      .rawQuery(
        `CREATE TABLE IF NOT EXISTS ${dbName}.users(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), gender VARCHAR(255), age VARCHAR(255))`
      )
      expect(result).to.not.be.an('error')
      expect(result).to.be.an("object");
      expect(result).to.include.keys(
        "fieldCount",
        "affectedRows",
        "insertId",
        "serverStatus",
        "warningStatus"
      );
     
  });

  testQueries.forEach((test) => {
    beforeEach(function () {
      mysqlUtil.setConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: dbName,
        connectionLimit: 25,
      });
    });
    it(test.description, async() => {
      let [queryType, tableName, fields, data, params] = test.input;
      const res = await mysqlUtil
        .query(queryType, tableName, fields, data, params)
       
          test.expects(res)
          // return res;
        
    });
  });
});
