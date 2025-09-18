const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'webcourse.cs.nuim.ie', // Replace with your MySQL server address if different
  user: 'u230541',   // Your MySQL username
  password: 'gee7meMeerohj9ai', // Your MySQL password
  database: 'cs230_u230541' // Your database name
});

// Ensure proper configuration
pool.config.connectionLimit = 10;
pool.config.waitForConnections = true;
pool.config.queueLimit = 0;

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Export the connection so other files can use it
module.exports = connection;