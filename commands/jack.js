const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jack')
		.setDescription('toggle jack admin'),

	async execute(interaction) {
		var jack = await interaction.guild.members.fetch('259082011539406848');
		var steven = await interaction.guild.members.fetch('118106537737584645');
		var current = await jack.roles.cache;
		console.log(JSON.stringify(interaction.member.id, steven));
		if (await interaction.member.id === steven.id) {
			if (current.has("774365462984523806")) {
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
