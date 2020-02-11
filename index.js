const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

let connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "admin",
    database: "washington_dc_db"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    connection.end();
  });
