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
describe("#Raw Queries:", () => {
  before(function () {
    mysqlUtil.setConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionLimit: 25,
    });
  });
  it("creates a new database when passed a raw query", async () => {
    const result = await mysqlUtil.rawQuery(
      "CREATE DATABASE IF NOT EXISTS kings_restaurant"
    );
    expect(result).to.be.an("object");
    expect(result).to.include.keys(
      "affectedRows",
      "fieldCount",
      "insertId",
      "serverStatus",
      "changedRows"
    );
    expect(result.affectedRows).to.equal(1);
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
    it("creates a new table inside the database", async () => {
      const result = await mysqlUtil.rawQuery(
        "CREATE TABLE IF NOT EXISTS customers(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255), phone VARCHAR(255))"
      );
      expect(result).to.be.an("object");
      expect(result).to.include.keys(
        "affectedRows",
        "fieldCount",
        "insertId",
        "serverStatus",
        "changedRows",
        "protocol41"
      );
      expect(result.protocol41).to.be.true;
    });
    it("Inserts a customer into table", async () => {
      const result = await mysqlUtil.insert("customers", reqBody);
      expect(result).to.be.an("object");
      expect(result).to.include.keys(
        "affectedRows",
        "fieldCount",
        "insertId",
        "serverStatus",
        "changedRows",
        "protocol41"
      );
      expect(result.protocol41).to.be.true;
      expect(result.affectedRows).to.equal(1);
    });
    it("selects all customers from table", async () => {
      const result = await mysqlUtil.rawQuery("select * from customers");
      expect(result).to.be.an("array");
      expect(result).length.to.be.greaterThanOrEqual(1);
      expect(result[0]).to.include.keys("id", "name", "address", "phone");
    });
    it("calls fetchCustomer stored procedure", async () => {
      const result = await mysqlUtil.rawQuery("call fetchCustomers()");
      expect(result).to.be.an("array");
      expect(result).length.to.be.greaterThanOrEqual(1);
    });
  });

  //   it("creates a new table inside the database", function (done) {
  //     before(function () {
  //       mysqlUtil.setConnectionPool({
  //         host: process.env.DB_HOST,
  //         user: process.env.DB_USER,
  //         password: process.env.DB_PASSWORD,
  //         database: "kings_restaurant",
  //         connectionLimit: 25,
  //       });
  //     });
  //     mysqlUtil
  //       .rawQuery(
  //         "CREATE TABLE IF NOT EXISTS kings_restaurant.customers(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255), phone VARCHAR(255))"
  //       )
  //       .then((res) => {
  //         console.log("New Res:", res);
  //         done();
  //         return res;
  //       })
  //       .catch((err) => {
  //         console.log("New Err:", err);
  //         done(err);
  //         return err;
  //       });
  //   });
  //   it("selects all kings_restaurant.customers from table", function (done) {
  //     mysqlUtil
  //       .rawQuery("select * from kings_restaurant.customers")
  //       .then((res) => {
  //         console.log("New Res:", res);
  //         done();
  //         // return res;
  //       })
  //       .catch((err) => {
  //         console.log("New Err:", err);
  //         done(err);
  //         return err;
  //       });
  //   });
});
