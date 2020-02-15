create database employee_management_db;

use employee_management_db;

create table department(
	id int not null auto_increment,
    name varchar(30) not null,
    primary key (id)
);

create table role(
	id int not null auto_increment,
    title varchar(30) not null,
    salary decimal(20,5) not null,
    department_id int not null,
    primary key (id)
);

create table employee(
	id int not null auto_increment,
    first_name varchar(30) not null,
	last_name varchar(30) not null,
    role_id int not null,
    manager_id int,
    primary key (id)
);