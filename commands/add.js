const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usernameList.db');

module.exports = {
  config: {
    name: 'add',
    description: 'Add a strike number and evidence for a username.',
    usage: '!add <username> <strike #> <evidence1> <evidence2> ... <evidenceN>',
  },
  run: (bot, message, args) => {
    // Check if the user has Administrator permissions
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.channel.send('You need Administrator permissions to use this command.');
    }

    const username = args[0];
    const strikeNumber = args[1];
    const evidence = args.slice(2); // Store multiple pieces of evidence as an array

    if (!username) {
      return message.channel.send('Please provide a username to add.');
    }

    if (!strikeNumber) {
      return message.channel.send('Please provide a strike number.');
    }

    if (evidence.length === 0) {
      return message.channel.send('Please provide one or more pieces of evidence for adding the strike.');
    }

    // Check if the username already exists in the database
    db.get('SELECT * FROM strikes WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('Error checking for duplicate username:', err);
        return message.channel.send('An error occurred while checking for duplicate username.');
      }

      if (row) {
        return message.channel.send(`Username "${username}" already exists in the list with strike number ${row.strikeNumber}.`);
      }

      // If the username doesn't exist, add it to the database along with the strike number and evidence
      db.run('INSERT INTO strikes (username, strikeNumber, evidence) VALUES (?, ?, ?)', [username, strikeNumber, evidence.join('\n')], (err) => {
        if (err) {
          console.error('Error adding strike to the database:', err);
          return message.channel.send('An error occurred while adding the strike.');
        }

        message.channel.send(
          `Username "${username}" added to the list with strike number ${strikeNumber} and evidence:\n${evidence.map((item, index) => `${index + 1}. ${item}`).join('\n')}`
        );
      });
    });
  },
};
