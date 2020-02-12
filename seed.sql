insert into department (name) values ('Sales');
insert into department (name) values ('Engineering');
insert into department (name) values ('IT');
insert into department (name) values ('HR');

insert into role (title, salary, department_id) values ('Salesperson', 50000, 1);
insert into role (title, salary, department_id) values ('Sales Lead', 80000, 1);
insert into role (title, salary, department_id) values ('Front End Developer', 80000, 2);
insert into role (title, salary, department_id) values ('Back End Developer', 80000, 2);
insert into role (title, salary, department_id) values ('Development Lead', 120000, 2);
insert into role (title, salary, department_id) values ('Help Desk', 40000, 3);
insert into role (title, salary, department_id) values ('Help Desk Coordinator', 70000, 3);
insert into role (title, salary, department_id) values ('HR Rep', 60000, 4);

insert into employee (first_name, last_name, role_id) values ('Bob', 'Smith', 2);
insert into employee (first_name, last_name, role_id, manager_id) values ('John', 'Doe', 1, 1);
insert into employee (first_name, last_name, role_id) values ('Suzy', 'Snowflake', 5);
insert into employee (first_name, last_name, role_id, manager_id) values ('Jane', 'Doe', 3, 3);
insert into employee (first_name, last_name, role_id, manager_id) values ('Shesells', 'Seashells', 4, 3);
insert into employee (first_name, last_name, role_id) values ('Peter', 'Piper', 7);
insert into employee (first_name, last_name, role_id, manager_id) values ('Autumn', 'Summer', 6, 6);
insert into employee (first_name, last_name, role_id) values ('Toby', 'Office', 8);