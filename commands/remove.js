const { MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usernameList.db');

module.exports = {
  config: {
    name: 'remove',
    description: 'Remove a username from the list.',
    usage: '!remove <username>',
  },
  run: (bot, message, args) => {
    // Check if the user has Administrator permissions
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.channel.send('You need Administrator permissions to use this command.');
    }

    const username = args[0];
    if (!username) {
      return message.channel.send('Please provide a username to remove.');
    }

    // Check if the username exists in the database
    db.get('SELECT * FROM strikes WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('Error checking for username:', err);
        return message.channel.send('An error occurred while checking for the username.');
      }

      if (!row) {
        return message.channel.send('Username not found in the list.');
      }

      // If the username exists, remove it from the database
      db.run('DELETE FROM strikes WHERE username = ?', [username], (err) => {
        if (err) {
          console.error('Error removing username:', err);
          return message.channel.send('An error occurred while removing the username.');
        }

        message.channel.send(`Username "${username}" removed from the list.`);
      });
    });
  },
};
