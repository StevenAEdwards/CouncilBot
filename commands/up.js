const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('up')
		.setDescription('Check if Discord Bot is Online'),
	async execute(interaction) {
		const user = await interaction.member;
		await interaction.reply(`${user.displayName} councilbot is online`);
	},
};
