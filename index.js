const inquirer = require('inquirer');
const mysql = require('mysql2');
// Add console.table if you plan to display data in table format

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '8hMiNc__q.-vVp',
    database: 'employee_tracker'
});

connection.connect(err => {
    if (err) throw err;
    mainMenu();
});

// Main menu function
function mainMenu() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ]
    })
    .then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

function viewAllDepartments() {
    const query = 'SELECT id, name FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewAllRoles() {
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        INNER JOIN department ON role.department_id = department.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}


function viewAllEmployees() {
    const query = `
        SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            role.title, 
            department.name AS department,
            role.salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN employee m ON e.manager_id = m.id
        INNER JOIN role ON e.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}


function addDepartment() {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ])
    .then(answer => {
        const query = 'INSERT INTO department (name) VALUES (?)';
        connection.query(query, [answer.newDepartment], (err, res) => {
            if (err) throw err;
            console.log(`Department added: ${answer.newDepartment}`);
            mainMenu();
        });
    });
}


function addRole() {
    // First, get the list of departments
    connection.query('SELECT id, name FROM department', (err, departments) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the new role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role?',
                validate: value => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return 'Please enter a valid number for the salary.';
                }
            },
            {
                name: 'departmentId',
                type: 'list',
                message: 'Which department does this role belong to?',
                choices: departments.map(department => {
                    return {
                        name: department.name,
                        value: department.id
                    };
                })
            }
        ])
        .then(answer => {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(query, [answer.title, answer.salary, answer.departmentId], (err, res) => {
                if (err) throw err;
                console.log(`Role added: ${answer.title}`);
                mainMenu();
            });
        });
    });
}


function addEmployee() {
    // Get roles and managers from the database first
    let query = 'SELECT id, title FROM role';
    connection.query(query, (err, roles) => {
        if (err) throw err;

        query = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
        connection.query(query, (err, managers) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: "What is the employee's first name?"
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: "What is the employee's last name?"
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: "What is the employee's role?",
                    choices: roles.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        };
                    })
                },
                {
                    name: 'managerId',
                    type: 'list',
                    message: "Who is the employee's manager?",
                    choices: managers.map(manager => {
                        return {
                            name: manager.name,
                            value: manager.id
                        };
                    }).concat([{ name: 'None', value: null }])
                }
            ])
            .then(answers => {
                const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                connection.query(query, [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, res) => {
                    if (err) throw err;
                    console.log(`Employee added: ${answers.firstName} ${answers.lastName}`);
                    mainMenu();
                });
            });
        });
    });
}


function updateEmployeeRole() {
    // Fetch employees and roles first
    let query = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
    connection.query(query, (err, employees) => {
        if (err) throw err;

        query = 'SELECT id, title FROM role';
        connection.query(query, (err, roles) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: "Which employee's role do you want to update?",
                    choices: employees.map(employee => {
                        return {
                            name: employee.name,
                            value: employee.id
                        };
                    })
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: "What is the employee's new role?",
                    choices: roles.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        };
                    })
                }
            ])
            .then(answers => {
                const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
                connection.query(query, [answers.roleId, answers.employeeId], (err, res) => {
                    if (err) throw err;
                    console.log("Employee's role updated successfully");
                    mainMenu();
                });
            });
        });
    });
}


// Start the application
mainMenu();
