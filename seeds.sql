-- Use the employee_tracker database
USE employee_tracker;

-- Insert data into 'department'
INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Finance'), ('Human Resources');

-- Insert data into 'role'
INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 100000, 1), ('Software Engineer', 120000, 2), ('Accountant', 75000, 3);

-- Insert data into 'employee'
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Smith', 2, 1);
