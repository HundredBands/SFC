const { MessageEmbed } = require('discord.js');
const REPORT_CHANNEL_ID = '1133151015001145424';
const db = require('sqlite3').verbose();

module.exports = {
  config: {
    name: 'report',
    description: 'Report a username with evidence.',
    usage: '!report <username> <evidence>',
  },
  run: async (bot, message, args) => {
    // Fetch the report channel using the provided ID
    const reportChannel = await bot.channels.fetch(REPORT_CHANNEL_ID);
    if (!reportChannel) {
      return message.channel.send('The report channel is not available.');
    }

    const username = args[0];
    const evidence = args.slice(1).join(' ');

    if (!username || !evidence) {
      return message.channel.send('Please provide both a username and evidence for the report.');
    }

    // Create an embed to format the report information.
    const embed = new MessageEmbed()
      .setColor('#FF0000') // You can set the desired color for the report embed.
      .setTitle('Reported User')
      .addFields(
        { name: 'Username', value: username },
        { name: 'Evidence', value: evidence },
      )
      .setTimestamp();

    // Send the report embed to the report channel.
    reportChannel.send({ embeds: [embed] });

    // Confirm to the user that the report was sent.
    message.channel.send(`The report for "${username}" with evidence "${evidence}" has been sent.`);
  },
};
