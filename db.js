const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username, often 'root'
    password: '8hMiNc__q.-vVp', // replace with your MySQL password
    database: 'employee_tracker' // replace with your database name
});

// Connect to MySQL server
connection.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

// Export the connection to use in other files
module.exports = connection;
