const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('discord.js');

const VOTING_TIME = 30;
const DEFAULT_MUTE_LENGTH = 30;
const DEFAULT_MESSAGE = "they are annoying."
const YES_EMOJI = '🔊';
const NO_EMOJI = '🔇';



module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Vote to Mute a Selected User')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('User to be Muted')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('duration')
				.setDescription('Number of Seconds The User Will Be Muted'))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason For User Mute')),

	async execute(interaction) {
		const target = interaction.options.getMember('target');
		const duration = interaction.options.getInteger('duration') || DEFAULT_MUTE_LENGTH;
		const reason = interaction.options.getString('reason') || DEFAULT_MESSAGE;
		await interaction.reply(`Voting to Mute ${target} for ${duration} seconds due to ${reason}`) ;
		const message = await interaction.fetchReply();
		message.react(NO_EMOJI);
		message.react(YES_EMOJI);
	}
}



function mute(member, timeout) {
    member.voice.setMute(true);

    setTimeout(() => {
        member.voice.setMute(false);
    }, timeout * 1000);
}

function unMute(member, _) {
    member.voice.setMute(false);
}




