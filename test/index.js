const dotenv = require("dotenv");
dotenv.config();
const faker = require('faker');
const mysqlUtil = require('../src/index');



var params = {
  where:[
      ['age','!=', 13],
      ['AND', 'gender', 'like', 'male'],
      ['OR', 'id', '=', 1]
  ]
};
var deleteParams = {
  where:[
   ['age','=',23],
   ['OR', 'name', 'like', '%Field Name%']
  ]
};
const updateParams = {
  where:[
    ['id','=', '22']
  ]
}

const updateBody = {
  "gender": "male"
};

const reqBody = {
  "name": faker.name.firstName() + " " + faker.name.lastName(),
  "age": Number((faker.random.number()).toString().slice(0,2)),
  "gender": faker.name.gender() == 'Man' ? 'Male' : 'Female'
};

const testQueries = [
  {
    input:["insert", "users", reqBody],
    description: "should insert a new user and return result"
  },
  {
    input:["select", "users", "null", params],
    description: "should return a specific user"
  },
  {
    input:["select", "users"],
    description: "should return all users"
  },
  { 
    input:["delete", "users", null, deleteParams],
    description: "should delete all users with age 40 and above"
  },
  {
    input:["update", "users", updateBody, updateParams],
    description: "Update user with id:22"
  }
];

beforeEach(function(){
  mysqlUtil.setConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 25
  });
});
describe("#test-queries()", () =>{
  testQueries.forEach((test) =>{
    it(test.description, () =>{
      var [queryType, tableName, requestBody, params] = test.input;
      mysqlUtil.runQuery(queryType, tableName, requestBody, params).then(data =>{
        console.log(data);
        return data;
      }).catch(err =>{
        console.log(err);
        return err;
      });
    });
  });
});


