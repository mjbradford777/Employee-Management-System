const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');
const events = require('events').EventEmitter.prototype._maxListeners = 100;
let employeeNames = [];
let roleList = [];
let departmentList = [];
let roleCodes = [];
let employeeCodes = [];
let departmentCodes = [];
let managerID;
let roleID;
let departmentID;
let firstName = '';
let lastName = '';
let managerFirstName = '';
let managerLastName = '';

let list = {
  type: 'list',
  name: 'selection',
  message: 'What do you want to do?',
  choices: ['View All Employees', 'View All Departments', 'View All Roles', 'View Employees By Manager', 'Add Employee', 'Add Department', 'Add Role', 'Update An Employee Role', 'Update Employee Manager', 'Delete Employee', 'End']
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
  choices: employeeNames
}
]

let departmentQuestions = {
  type: 'input',
  name: 'name',
  message: 'What is the name of the department?'
}

let roleQuestions = [{
  type: 'input',
  name: 'title',
  message: 'What is the title of the role?'
},
{
  type: 'input',
  name: 'salary',
  message: 'What is the role\'s salary?'
},
{
  type: 'list',
  name: 'department',
  message: 'What department does the role belong to?',
  choices: departmentList
}]

let updateRoleQuestions = [{
  type: 'list',
  name: 'name',
  message: 'Which employee would you like to update?',
  choices: employeeNames
},
{
  type: 'list',
  name: 'role',
  message: 'What role do they have?',
  choices: roleList
}]

let updateManagerQuestions = [{
  type: 'list',
  name: 'employee',
  message: 'Which employee do you want to update?',
  choices: employeeNames
},
{
  type: 'list',
  name: 'manager',
  message: 'Which employee will manage them?',
  choices: employeeNames
}]

let managerViewQuestions = {
  type: 'list',
  name: 'manager',
  message: 'View by which manager?',
  choices: employeeNames
}

let deleteEmployeeQuestions = {
  type: 'list',
  name: 'employee',
  message: 'Which employee would you like to delete?',
  choices: employeeNames
}

let connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "admin",
    database: "employee_management_db"
  });

  const finishAddingEmployee = () => {
    fillEmployeeNames();
    codeEmployees();
    inquire();
  }

  const finishUpdatingManager = () => {
    connection.query(`update employee set manager_id = ${managerID} where first_name = '${firstName}' AND last_name = '${lastName}'`, function(err, res) {
      if (err) throw err;
      fillEmployeeNames();
      codeEmployees();
      inquire();
    })
  }

  const finishManagerView = () => {
    connection.query(`select first_name, last_name from employee where manager_id = ${managerID}`, function(err, res) {
      if (err) throw err;
      console.table(res);
      inquire();
    })
  }

  const codeEmployees = () => {
    connection.query('select id, first_name, last_name from employee', function(err, res) {
      if (err) throw err;
      employeeCodes = res;
    })
  }

  const codeRoles = () => {
    connection.query('select id, title from role', function(err, res) {
      if (err) throw err;
      if (roleCodes.length !== 0) {
        roleCodes = [];
      }
      roleCodes = res;
    })
  }

  const codeDepartments = () => {
    connection.query('select id, name from department', function(err, res) {
      if (err) throw err;
      if (departmentCodes.length !== 0) {
        departmentCodes = [];
      }
      departmentCodes = res;
    })
  }

  const fillEmployeeNames = () => {
    connection.query('select * from employee', function(err, res) {
      if (err) throw err;
      if (employeeNames.length !== 0) {
        employeeNames = [];
      }
      employeeNames.push('None');
      for (let i = 0; i < res.length; i++) {
        employeeNames.push(`${res[i].first_name} ${res[i].last_name}`)
      }
      employeeQuestions[3] =
      {
        type: 'list',
        name: 'manager',
        message: 'Who is the employee\'s manager?',
        choices: employeeNames
      }
    })
  }

  const fillRoles = () => {
    connection.query('select * from role', function(err, res) {
      if (err) throw err;
      if (roleList.length !== 0) {
        roleList = [];
      }
      for (let i = 0; i < res.length; i++) {
        roleList.push(res[i].title)
      }
      employeeQuestions[2] = {
        type: 'list',
        name: 'role',
        message: 'What is the employee\'s role?',
        choices: roleList
      }
    })
  }

  const fillDepartments = () => {
    connection.query('select * from department', function(err, res) {
      if (err) throw err;
      if (departmentList.length !== 0) {
        departmentList = [];
      }
      for (let i = 0; i < res.length; i++) {
        departmentList.push(res[i].name)
      }
      roleQuestions[2] = {
        type: 'list',
        name: 'department',
        message: 'What department does the role belong to?',
        choices: departmentList
      };
    })
  }

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

  const viewByManager = () => {
    inquirer.prompt(managerViewQuestions).then(
      answers => {
        if (answers.manager === 'None') {
          console.log('Invalid choice');
          inquire();
        } else {
          for (let i = 0; i < answers.manager.length; i++) {
            if (answers.manager.charAt(i) === ' ') {
              for (let j = 0; j < i; j++) {
                managerFirstName += answers.manager[j];
              }
              for (let k = i + 1; k < answers.manager.length; k++) {
                managerLastName += answers.manager[k];
              }
            }
          }
        }

        connection.query(`select id from employee where first_name = '${managerFirstName}' AND last_name = '${managerLastName}'`, function(err, res) {
          if (err) throw err;
          managerID = res[0].id;
          finishManagerView();
        })
      }
    )
  }

  const addEmployee = () => {
    inquirer.prompt(employeeQuestions).then(
      answers => {
        for (let i = 0; i < roleCodes.length; i++) {
          if (roleCodes[i].title === answers.role) {
            roleID = roleCodes[i].id;
          }
        }
        if (answers.manager === 'None') {
          managerID = null;
        } else {
          for (let i = 0; i < employeeCodes.length; i++) {
            if (`${employeeCodes[i].first_name} ${employeeCodes[i].last_name}` === answers.manager) {
              managerID = employeeCodes[i].id;
            }
          }
        }
        connection.query(`insert into employee (first_name, last_name, role_id, manager_id) values ('${answers.firstName}', '${answers.lastName}', ${roleID}, ${managerID})`, function(err, res) {
          if (err) throw err;
          console.log(`${answers.firstName} ${answers.lastName} added`);
          finishAddingEmployee();
        })
      }
    )
  }

  const addDepartment = () => {
    inquirer.prompt(departmentQuestions).then(
      answers => {
        connection.query(`insert into department (name) values ('${answers.name}')`, function(err, res) {
          if (err) throw err;
          console.log(`${answers.name} added`);
          codeDepartments();
          fillDepartments();
          inquire();
        })
      }
    )
  }

  const addRole = () => {
    inquirer.prompt(roleQuestions).then(
      answers => {
        for (let i = 0; i < departmentCodes.length; i++) {
          if (departmentCodes[i].name === answers.department) {
            departmentID = departmentCodes[i].id;
          }
        }
        connection.query(`insert into role (title, salary, department_id) values ('${answers.title}', ${answers.salary}, ${departmentID})`, function(err, res) {
          if (err) throw err;
          console.log(`${answers.title} added`);
          codeRoles();
          fillRoles();
          inquire();
        })
      }
    )
  }

  const updateRole = () => {
    inquirer.prompt(updateRoleQuestions).then(
      answers => {
        for (let i = 0; i < answers.name.length; i++) {
          if (answers.name.charAt(i) === ' ') {
            for (let j = 0; j < i; j++) {
              firstName += answers.name[j];
            }
            for (let k = i + 1; k < answers.name.length; k++) {
              lastName += answers.name[k];
            }
          }
        }
        for (let i = 0; i < roleCodes.length; i++) {
          if (roleCodes[i].title === answers.role) {
            roleID = roleCodes[i].id;
          }
        }
        connection.query(`update employee set role_id = ${roleID} where first_name = '${firstName}' AND last_name = '${lastName}'`, function(err, res) {
          if (err) throw err;
          fillEmployeeNames();
          codeEmployees();
          inquire();
        })
      }
    )
  }

  const updateManager = () => {
    inquirer.prompt(updateManagerQuestions).then(
      answers => {
        if (answers.employee === answers.manager) {
          console.log('Invalid choice');
          inquire();
        } else {
          for (let i = 0; i < answers.employee.length; i++) {
            if (answers.employee.charAt(i) === ' ') {
              for (let j = 0; j < i; j++) {
                firstName += answers.employee[j];
              }
              for (let k = i + 1; k < answers.employee.length; k++) {
                lastName += answers.employee[k];
              }
            }
          }

          if (answers.manager === 'None') {
            managerID = null;
            finishUpdatingManager();
          } else {
            for (let i = 0; i < answers.manager.length; i++) {
              if (answers.manager.charAt(i) === ' ') {
                for (let j = 0; j < i; j++) {
                  managerFirstName += answers.manager[j];
                }
                for (let k = i + 1; k < answers.manager.length; k++) {
                  managerLastName += answers.manager[k];
                }
              }
            }
  
            connection.query(`select id from employee where first_name = '${managerFirstName}' AND last_name = '${managerLastName}'`, function(err, res) {
              if (err) throw err;
              managerID = res[0].id;
              finishUpdatingManager();
            })
          }
        }
      }
    )
  }

  const deleteEmployee = () => {
    inquirer.prompt(deleteEmployeeQuestions).then(
      answers => {
        for (let i = 0; i < answers.employee.length; i++) {
          if (answers.employee.charAt(i) === ' ') {
            for (let j = 0; j < i; j++) {
              firstName += answers.employee[j];
            }
            for (let k = i + 1; k < answers.employee.length; k++) {
              lastName += answers.employee[k];
            }
          }
        }

        connection.query(`delete from employee where first_name = '${firstName}' AND last_name = '${lastName}'`, function(err, res) {
          if (err) throw err;
          console.log(`${firstName} ${lastName} has been deleted`);
          fillEmployeeNames();
          codeEmployees();
          inquire();
        })
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
          } else if (answers.selection === 'Add Department') {
            addDepartment();
          } else if (answers.selection === 'Add Role') {
            addRole();
          } else if (answers.selection === 'Update An Employee Role') {
            updateRole();
          } else if (answers.selection === 'Update Employee Manager') {
            updateManager();
          } else if (answers.selection === 'View Employees By Manager') {
            viewByManager();
          } else if (answers.selection === 'Delete Employee') {
            deleteEmployee();
          }
        }
      );
  }

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    fillEmployeeNames();
    fillRoles();
    fillDepartments();
    codeEmployees();
    codeRoles();
    codeDepartments();
    inquire();
  });