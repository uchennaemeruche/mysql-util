const mysql = require("mysql");

let connectionObj = {
  connection: null,
  conn: async function (con) {
    this.connection = con;
    return this.conneciton;
  },
  async getConn() {
    return await this.connection;
  },
};

exports.setConnection = async ({
  host,
  user,
  password,
  database,
  connectionLimit,
}) => {
  let connectionString = await mysql.createPool({
    host,
    user,
    password,
    database,
    connectionLimit,
  });
  await connectionObj.conn(connectionString);
};

let _required = (val) => {
  throw new Error(`${val} is required`);
};

let checkParamType = (data) => {
  if (typeof data == "string") return `'${data}'`;
  else return `${data}`;
};

let matchQueryFilters = (query, params) => {
  let counter = 0;
  params[0].unshift("");
  for (let param in params) {
    query +=
      `${params[param][1]} ${params[param][2]} ` +
      checkParamType(params[param][3]);
    counter++;
    if (counter < params.length) {
      query += ` ${params[counter][0]} `;
    }
  }
  return query;
};

let checkOptionsType = (options, op) => {
  let query;
  if (options.length == 1 && typeof options[0] != "string") {
    let values = options[0];
    values.queryKeyword = op;
    query = constructQuery(values);
  } else {
    if (op == "select")
      query = constructQuery({
        queryKeyword: op,
        tableName: options[0],
        fields: options[1],
        params: options[2],
      });
    else if (op == "insert")
      query = constructQuery({
        queryKeyword: op,
        tableName: options[0],
        data: options[1],
      });
    else if (op == "update")
      query = constructQuery({
        queryKeyword: op,
        data: options[1],
        tableName: options[0],
        params: options[2],
      });
    else if (op == "delete")
      query = constructQuery({
        queryKeyword: op,
        tableName: options[0],
        params: options[1],
      });
  }
  return query;
};

module.exports.select = (...options) => {
  let query = checkOptionsType(options, "select");
  return runQuery(query);
};

module.exports.insert = (...options) => {
  let query = checkOptionsType(options, "insert");
  return runQuery(query);
};

module.exports.update = (...options) => {
  let query = checkOptionsType(options, "update");
  return runQuery(query);
};

module.exports.delete = (...options) => {
  let query = checkOptionsType(options, "delete");
  return runQuery(query);
};

// module.exports.callProcedure();

let constructQuery = ({
  queryKeyword = _required("queryType"),
  fields = null,
  tableName = _required("tableName"),
  data,
  params = null,
}) => {
  const keyWords = {
    SELECT: "select",
    UPDATE: "update",
    DELETE: "delete",
    INSERT: "insert",
  };

  let query = ``;

  if (queryKeyword == keyWords.SELECT) {
    if (fields == null || fields == "*") query = `SELECT *`;
    else {
      query = `SELECT `;
      let fieldsLength = fields.length;
      let counter = 0;
      fields.forEach((field) => {
        query += `${field}`;
        counter++;
        if (counter < fieldsLength) {
          query += `, `;
        }
      });
    }

    if (params == null) query += ` FROM ${tableName}`;
    else {
      query += ` FROM ${tableName} WHERE `;
      query = matchQueryFilters(query, params);

      //   query = `SELECT * FROM ${tableName} WHERE `;
      //   query = matchQueryFilters(query, params);
    }
  } else if (queryKeyword == keyWords.UPDATE) {
    query = `UPDATE ${tableName} SET `;
    let fieldLength = Object.entries(data).length;
    let counter = 0;
    for (let field in data) {
      query += `${field} = ` + checkParamType(data[field]);
      counter++;
      if (counter < fieldLength) query += `, `;
    }
    counter = 0;
    query += ` WHERE `;

    query = matchQueryFilters(query, params);
  } else if (queryKeyword == keyWords.INSERT) {
    let fieldLength = Object.entries(data).length;
    let counter = 0;

    query = `INSERT INTO ${tableName} (`;
    for (let field in data) {
      query += `${field}`;
      counter++;
      if (counter < fieldLength) query += `, `;
      else {
        query += `) VALUES(`;
        counter = 0;
        for (let value in data) {
          query += checkParamType(data[value]);
          counter++;
          if (counter < fieldLength) {
            query += `, `;
          } else {
            query += `)`;
          }
        }
      }
    }
  } else if (queryKeyword == keyWords.DELETE) {
    if (params == null) query = `DELETE FROM ${tableName}`;
    else {
      query = `DELETE FROM ${tableName} WHERE `;

      query = matchQueryFilters(query, params);
    }
  }
  return query;
};

let runQuery = (query) => {
  return new Promise((resolve) => {
    try {
      queryDb(query, (err, result) => {
        if (err) {
          resolve(err);
        } else {
          resolve(result);
        }
      });
    } catch (err) {
      resolve(err.message);
    }
  });
};

module.exports.query = (queryType, tableName, fields, data, params) => {
  let query = constructQuery({
    queryKeyword: queryType,
    fields,
    tableName,
    data,
    params,
  });
  return new Promise((resolve) => {
    try {
      queryDb(query, (err, result) => {
        if (err) {
          resolve(err);
        } else {
          resolve(result);
        }
      });
    } catch (err) {
      resolve(err.message);
    }
  });
};

let queryDb = (query, result) => {
  let getConnectionFromPool = async function () {
    await connectionObj.getConn();
    connectionObj.connection.query(query, (err, res) => {
      if (err) {
        console.log("Error:", err);

        if (err.code == "ECONNREFUSED") {
          getConnectionFromPool();
          return;
        }
        console.log("Error:", err);

        result(err, null);
        return;
      }
      if (res) {
        result(null, res);
        return;
      }
    });
  };
  getConnectionFromPool();
};
