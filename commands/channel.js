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
        
		const channel1 = user.voice.channel.id;
		const channel2 = target.voice.channel.id;
		//let allMembers = user.voice.channel.members;
		
		
		await interaction.reply(`User: ${channel1} Target: ${channel2}`);
	},
};
