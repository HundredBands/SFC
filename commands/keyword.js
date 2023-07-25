const { MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usernameList.db');

module.exports = {
  config: {
    name: 'search',
    description: 'Searches the list for usernames containing the specified keyword and displays matching results.',
    usage: '!search <keyword>',
  },
  run: (bot, message, args) => {
    const keyword = args.join(' ').toLowerCase();

    if (!keyword) {
      return message.channel.send('Please provide a keyword to search.');
    }

    // Fetch usernames and their corresponding reasons from the database
    db.all('SELECT username, strikeNumber, evidence FROM strikes', (err, rows) => {
      if (err) {
        console.error('Error fetching usernames:', err);
        return message.channel.send('An error occurred while fetching the usernames.');
      }

      // Filter the rows to find matches with the keyword
      const matches = rows.filter((row) => row.username.toLowerCase().includes(keyword));

      // Check if there are any matches
      if (matches.length === 0) {
        return message.channel.send('No matches found for the provided keyword.');
      }

      // Create a new MessageEmbed instance for displaying matches
      const embed = new MessageEmbed()
        .setColor('#4B0082') // Set the embed color
        .setTitle(`Username Matches for "${keyword}"`); // Set the embed title

      // Add each matching username and its corresponding reason as separate fields in the embed
      matches.forEach((match) => {
        embed.addFields(
          { name: 'Username', value: match.username, inline: true },
          { name: 'Evidence', value: match.evidence || 'No evidence provided', inline: true },
        );
      });

      // Send the embed message with the matching results
      message.channel.send({ embeds: [embed] });
    });
  },
};
