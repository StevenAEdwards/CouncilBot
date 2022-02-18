const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('Replies with Users Channel Info'),
	async execute(interaction) {

        const channel = interaction.member.voice.channel.id;
		await interaction.reply(`User is in ${channel}`);
	},
};
