const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

let connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "admin",
    database: "employee_management_db"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
    });
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
    });
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  });
