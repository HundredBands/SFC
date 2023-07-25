const { MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usernameList.db');

module.exports = {
  config: {
    name: 'count',
    description: 'Get the count of usernames in the list.',
    usage: '!count',
  },
  run: (bot, message) => {
    // Check if the 'username' table exists
    db.get("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='usernames'", (err, row) => {
      if (err) {
        console.error('Error checking for username table:', err);
        return message.channel.send('An error occurred while checking for the username table.');
      }

      if (!row['count(*)']) {
        // If the 'username' table does not exist, create it
        db.run(`
          CREATE TABLE usernames (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE
          )`, (err) => {
          if (err) {
            console.error('Error creating username table:', err);
            return message.channel.send('An error occurred while creating the username table.');
          }

          // Table 'username' created successfully
          // Now fetch the count of usernames and send the message
          fetchAndSendCount();
        });
      } else {
        // If the 'username' table already exists, fetch the count of usernames and send the message
        fetchAndSendCount();
      }
    });

    // Function to fetch the count of usernames and send the message
    function fetchAndSendCount() {
      // Fetch the count of usernames from the database
      db.get('SELECT COUNT(*) AS count FROM strikes', (err, row) => {
        if (err) {
          console.error('Error fetching username count:', err);
          return message.channel.send('An error occurred while fetching the username count.');
        }

        const count = row.count;

        // Create a new MessageEmbed instance
        const embed = new MessageEmbed()
          .setColor('#4B0082') // Set the embed color
          .setTitle('Username Count') // Set the embed title
          .setDescription(`There are ${count} people in the list.`); // Set the embed description

        // Send the embed message
        message.channel.send({ embeds: [embed] });
      });
    }
  },
};
