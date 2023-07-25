const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usernameList.db');

const ITEMS_PER_PAGE = 5; // Number of items to display per page

module.exports = {
  config: {
    name: 'view',
    description: 'View all usernames, strike numbers, and evidence in the list or a specific username and its details.',
    usage: '!view [username]',
  },
  run: (bot, message, args) => {
    // Function to create a string with a page of usernames, strike numbers, and evidence
    function createPageString(data, page) {
      const startIndex = page * ITEMS_PER_PAGE;
      let pageString = '```Markdown\n'; // Use Markdown formatting for the list

      for (let i = startIndex; i < data.length && i < startIndex + ITEMS_PER_PAGE; i++) {
        const row = data[i];
        pageString += `[${row.username}] - Strike Number: ${row.strikeNumber}\n`;
        pageString += `Evidence: ${row.evidence || 'No evidence provided'}\n\n`;
      }

      pageString += '```';
      return pageString;
    }

    // Fetch usernames, strike numbers, and evidence from the database
    db.all('SELECT username, strikeNumber, evidence FROM strikes', (err, rows) => {
      if (err) {
        console.error('Error fetching data:', err);
        return message.channel.send('An error occurred while fetching the data.');
      }

      // Check if there are any entries in the list
      if (rows.length === 0) {
        return message.channel.send('The list is empty.');
      }

      // Check the number of arguments
      if (args.length === 0) {
        // Display the paginated list of all usernames, strike numbers, and evidence

        let page = 0;
        const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);

        // Function to send the paginated message
        const sendPage = async (pageIndex, lastMsg) => {
          // Update the page number
          page = pageIndex;
          if (page < 0) page = 0;
          if (page >= totalPages) page = totalPages - 1;

          // Create the message content with the new page of data
          const pageString = createPageString(rows, page);

          // Create the "Previous" and "Next" buttons
          const previousButton = new MessageButton()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle('PRIMARY')
            .setDisabled(page === 0);

          const nextButton = new MessageButton()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle('PRIMARY')
            .setDisabled(page === totalPages - 1);

          // Create the action row with the buttons
          const actionRow = new MessageActionRow()
            .addComponents(previousButton)
            .addComponents(nextButton);

          // Send the paginated message and delete the last message if it exists
          if (lastMsg) lastMsg.delete().catch((error) => console.error('Error deleting message:', error));
          message.channel.send({ content: pageString, components: [actionRow] }).then((msg) => {
            lastMsg = msg;

            // Create a collector for the button interactions
            const filter = (button) => ['previous', 'next'].includes(button.customId) && button.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 10000 });

            // Event for when a user interacts with a button
            collector.on('collect', (button) => {
              if (button.customId === 'previous') {
                sendPage(page - 1, lastMsg);
              } else if (button.customId === 'next') {
                sendPage(page + 1, lastMsg);
              }
              button.deferUpdate();
            });

            // Event for when the collector ends
            collector.on('end', () => {
              // Remove buttons after the collector ends
              actionRow.components.forEach((component) => component.setDisabled(true));
              msg.edit({ components: [actionRow] }).catch((error) => console.error('Error editing message:', error));

              // Delete the last message after the collector ends
              if (lastMsg) lastMsg.delete().catch((error) => console.error('Error deleting message:', error));
            });
          });
        };

        sendPage(0); // Send the first page
      } else if (args.length === 1) {
        // Fetch the specific username, strike number, and evidence from the database
        const username = args[0];
        const row = rows.find((entry) => entry.username.toLowerCase() === username.toLowerCase());

        if (!row) {
          return message.channel.send('Username not found in the list.');
        }

        // Create a string with the details for the specific username
        const detailsString = `Username: ${row.username}\nStrike Number: ${row.strikeNumber}\nEvidence: ${row.evidence || 'No evidence provided'}`;
        message.channel.send(`\`\`\`Markdown\n${detailsString}\n\`\`\``);
      } else {
        return message.channel.send(
          'Invalid command usage. Use `!view` to see all usernames, strike numbers, and evidence, or `!view <username>` to see a specific username and its details.'
        );
      }
    });
  },
};
