const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jack')
		.setDescription('toggle jack admin'),

	async execute(interaction) {
		var jack = await interaction.guild.members.fetch('259082011539406848');
		var user = await interaction.member.fetch();
		var currentJack = await jack.roles.cache;
		var currentUser = await user.roles.cache;

		if (currentUser.has("774365462984523806")) {
			if (currentJack.has("774365462984523806")) {
				jack.roles.remove("774365462984523806");
				await interaction.reply(`Removed`);
			}
			else {
				jack.roles.add("774365462984523806");
				await interaction.reply(`GL everyone`);
			}
		}
		else{
			await interaction.reply(`Not Valid User`)
		}
	},
};
