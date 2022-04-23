const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('Replies with Users Channel Info')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('User to Compare')
				.setRequired(false)),
	async execute(interaction) {
		let user = await interaction.member.fetch();
		let target = interaction.options.getMember('target');
        let channel1 = await interaction.client.channels.fetch(user.voice?.channel?.id)
		if(target === null){
			await interaction.reply(`You are in ${channel1}`);
		}
		else{
			let channel2 = await interaction.client.channels.fetch(target.voice?.channel?.id)
			await interaction.reply(`You are in ${channel1} Your Target is in ${channel2}`);
		}
		
	},
};
