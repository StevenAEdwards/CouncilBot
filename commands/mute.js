const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message, ThreadChannel } = require('discord.js');

const VOTING_TIME = 30;
const DEFAULT_MUTE_LENGTH = 30;
const DEFAULT_MESSAGE = "their actions"
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
		const commander = interaction.member;
		const duration = interaction.options.getInteger('duration') || DEFAULT_MUTE_LENGTH;
		const reason = interaction.options.getString('reason') || DEFAULT_MESSAGE;
		
		const message = await interaction.reply({ content:`Voting to Mute ${target} for ${duration} seconds due to ${reason}.`, fetchReply: true });
		message.react(NO_EMOJI);
		message.react(YES_EMOJI);

		mute(target,DEFAULT_MUTE_LENGTH);

	}
}

function compareMemberChannels(member1,member2){
	console.log(member1.voice.channelId);
	console.log(member2.voice.channelId);
	if(member1.voice.channel.id == member2.voice.channel.id){
		return true;
	}
	return false;
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




