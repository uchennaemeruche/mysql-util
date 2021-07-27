const dotenv = require("dotenv");
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
    description: "Should delete all records from the database",
  },
  {
    input: ["insert", "users", "", reqBody, ""],
    description: "should insert a new user and return result",
  },

  {
    description: "Should return all columns and rows in the user table",
    input: ["select", "users"],
  },
  {
    description:
      "Should return the name and age of a specific user whose ID =1",
    input: ["select", "users", ["name", "age"], "", [["id", "=", 1]]],
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
  },

  {
    input: ["delete", "users", "_", "", [["id", "=", "50"]]],
    description: "should delete all users whose age is 50",
  },
  {
    input: ["update", "users", "", updateBody, [["id", "=", "51"]]],
    description: "should update gender of user with id:52",
  },
  {
    input: ["insert", "users", "", reqBody2, ""],
    description: "should insert a new user and return result",
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
  testQueries.forEach((test) => {
    it(test.description, () => {
      // var [tableName, fields, params] = test.input;
      // eslint-disable-next-line no-unused-vars
      var [queryType, tableName, fields, data, params] = test.input;

      // mysqlUtil
      //   .select(tableName, fields)
      //   .then((res) => {
      //     console.log("Res: ", res);
      //     return res;
      //   })
      //   .catch((error) => {
      //     return error;
      //   });

      mysqlUtil
        .query(queryType, tableName, fields, data, params)
        // .select(tableName, fields, params)
        .then((res) => {
          console.log(res);
          return res;
        })
        .catch((err) => {
          return err;
        });
    });
  });
});
