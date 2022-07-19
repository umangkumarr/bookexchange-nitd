const mysql = require("mysql");

var host = "remotemysql.com";
var user = "jOkKAWvD1B";
var pass = "QWwUrNndq0";
var database = "jOkKAWvD1B";

//creating a pool because err come with mysqlConnection
var mysqlConnection = mysql.createPool({
    host: host,
    user: user,
    password: pass,
    database: database,
    connectionLimit: 10,
    multipleStatements: true
})

module.exports = mysqlConnection