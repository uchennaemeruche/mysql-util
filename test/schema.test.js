const dotenv = require("dotenv");
const expect = require("chai").expect;
const faker = require("faker");

const mysqlUtil = require("../src/index");

dotenv.config();


const reqBody = {
  name: faker.name.firstName() + " " + faker.name.lastName(),
  phone: faker.phone.phoneNumber(),
  address: faker.address.streetAddress(),
};

before(function () {
  mysqlUtil.setConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 25,
  });
});
describe("#Raw Queries:", () => {
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
      .rawQuery("CREATE DATABASE IF NOT EXISTS kings_restaurant")

      expect(result).to.not.be.an('error')
      expect(result).to.be.an("object");
      expect(result).to.include.keys(
        "fieldCount",
        "affectedRows",
        "insertId",
        "serverStatus",
      );
      
  });
  describe("operations on Database schema", () => {
    beforeEach(function () {
      mysqlUtil.setConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "kings_restaurant",
        connectionLimit: 25,
      });
    });
    it("creates a new table inside the database", async() => {
      const result = await mysqlUtil
        .rawQuery(
          "CREATE TABLE IF NOT EXISTS customers(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255), phone VARCHAR(255))"
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
    it("Inserts a customer into table", async() => {
      const result = await mysqlUtil.insert("customers", reqBody)

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
      
    });
    it("throws an error for an invalid request Body or column list", async() => {
      const invalidReqeqBody = {
        name: "Uchenna",
        age: "",
        gender: "Male",
        address: "No mans land"
      }
      const result = await mysqlUtil.insert("customers", invalidReqeqBody)

        expect(result).to.be.an('error')
        expect(result).to.not.be.an("object");
        expect(result.toString()).to.contain("Unknown column")
      
    });
    it("selects all customers from table", async() => {
      const result = await mysqlUtil.rawQuery("select * from customers")
      
      expect(result).to.not.be.an('error')
      expect(result).to.be.an("array");
      expect(result).length.to.be.greaterThanOrEqual(1);
      expect(result[0]).to.include.keys("id", "name", "address", "phone");
    
    });
    it("throws an error for invalid table name", async() => {
      const invalidTableName = 'customerstbl'
      const result = await mysqlUtil.rawQuery(`select * from ${invalidTableName}`)
      expect(result).to.be.an('error')
      expect(result).to.not.be.an("array");

      const regExpTestMatch = new RegExp(`${invalidTableName} doesnt exist`, 'gi')
      const errorMsg = result.toString().replace(/'/g,'').split('.').join(' ')
      const matches = errorMsg.match(regExpTestMatch)
      expect(matches).to.be.an('array')
      expect(matches).to.contain(`${invalidTableName} doesnt exist`)
    
    });
    it("throws an error for an unknown or undefined stored procedure", async() => {
      const result = await mysqlUtil.rawQuery("call undefinedStoredProcedureName()");
      expect(result).to.be.an('error')
      
    });
    it("calls fetchCustomers stored procedure", async() => {
      const result = await mysqlUtil.rawQuery("call fetchCustomers()");
      expect(result).to.not.be.an('error')
      expect(result).to.be.an("array")
    });
  });
});
