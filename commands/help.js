const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'help',
    description: 'Gets all of the commands.',
    usage: `!help`,
  },
  async run(bot, message, args) {
    // Create a new MessageEmbed instance
    const embed = new MessageEmbed()
      .setColor('#4B0082') // Hex color code or predefined color name
      .setTimestamp()
      .setAuthor({
        name: ('Sword Fighting Community - Justice Panel'),
        iconURL: bot.user.avatarURL,
      });

    // Add fields to the embed using addFields method
    embed.addFields(
      {name: 'Help', value: '`!help - Will show you all of the current commands that the bot has to offer.`' },
      {name: 'Ping', value: '`!ping - Checks the bots current latency ping.`' },
      {name: 'View', value: '`!view | !view <username> - This will show you all usernames in the list, or a specific username.`'},
      {name: 'Count', value: '`!count - Shows the total number of usernames in the list.`'},
      {name: 'Report', value: '`!report <username> <evidence> - Reports the user provided with the evidence to the staff team.`'},
      {name: 'Search', value: '`!search <keyword> - Searched the entire list of usernames/reasons for the keyword and displays the result.`'},
      {name: 'Add (Administrator)', value: '`!add <username> <reason> - Adds the username and reason provided to a list of known exploiters.`'},
      {name: 'Remove (Administrator)', value: '`!remove <case> or <username> - Removes the case and or username from the list of known exploiters.`'},
      // Add more fields as needed
    );

    // Send the embed message
    message.channel.send({ embeds: [embed] });
  },
};
