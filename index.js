const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

let list = {
  type: 'list',
  name: 'selection',
  message: 'What do you want to do?',
  choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Department', 'Add Role', 'End']
}

let employeeQuestions = [{
  type: 'input',
  name: 'firstName',
  message: 'What is the employee\'s first name?'
},
{
  type: 'input',
  name: 'lastName',
  message: 'What is the employee\'s last name?'
},
{
  type: 'list',
  name: 'role',
  message: 'What is the employee\'s role?',
  choices: roleList
},
{
  type: 'list',
  name: 'manager',
  message: 'Who is the employee\'s manager?',
  choices: managerList
}
]

let connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "admin",
    database: "employee_management_db"
  });

  const readEmployees = () => {
    connection.query('select employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, department.name from employee inner join role on employee.role_id = role.id inner join department on role.department_id = department.id', function(err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        res[i].department_name = res[i].name;
        delete res[i].name;
        if(res[i].manager_id !== null) {
          for (let j = 0; j < res.length; j++) {
            if (res[i].manager_id === res[j].id) {
              res[i].manager_name = `${res[j].first_name} ${res[j].last_name}`;
              delete res[i].manager_id;
            }
          }
        } else {
          res[i].manager_name = null;
          delete res[i].manager_id;
        }
      }
      console.table(res);
      inquire();
    });
  }

  const readRoles = () => {
    connection.query('select role.title, role.salary, role.department_id, department.id, department.name from role inner join department on role.department_id = department.id', function(err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        res[i].department_name = res[i].name;
        delete res[i].name;
        delete res[i].department_id;
        delete res[i].id;
      }
      console.table(res);
      inquire();
    });
  }

  const readDepartments = () => {
    connection.query('select * from department', function(err, res) {
      if (err) throw err;
      console.table(res);
      inquire();
    });
  }

  const addEmployee = () => {
    inquirer.prompt(employeeQuestions).then(
      answers => {
        console.log(answers);
        inquire();
      }
    )
  }

  const inquire = () => {
    inquirer
      .prompt(list).then(
        answers => {
          if (answers.selection === 'View All Employees') {
            readEmployees();
          } else if (answers.selection === 'View All Departments') {
            readDepartments();
          } else if (answers.selection === 'View All Roles') {
            readRoles();
          } else if (answers.selection === 'End') {
            connection.end();
          } else if (answers.selection === 'Add Employee') {
            addEmployee();
          }
        }
      );
  }

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    inquire();
  });