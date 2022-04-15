const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info!'),
	async execute(interaction) {

		const target = interaction.options.getMember('259082011539406848');
        target.roles.remove("774365462984523806");
		await interaction.reply(`LOL`);
	},
};
