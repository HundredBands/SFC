const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usernameList.db');

// Create the 'usernames' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS strikes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  strikeNumber INTEGER NOT NULL,
  evidence TEXT NOT NULL
  )`, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table "usernames" created successfully.');
  }
});

db.close(); // Close the database connection after creating the table
