const { SlashCommandBuilder, SlashCommandRoleOption } = require('@discordjs/builders');
const { Message, ThreadChannel, Collection, GuildMember } = require('discord.js');

const VOTING_TIME = 30;			//seconds
const MIN_MUTE_LENGTH = 30; 	
const MAX_MUTE_LENGTH = 180;
const DEFAULT_MESSAGE = 'their actions';	
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
				// .setDescription('Seconds Muted, Min:30 Max:180'))
				.setDescription('Seconds Muted, Min:' + MIN_MUTE_LENGTH + ' Max:' + MAX_MUTE_LENGTH))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason For User Mute')),

	async execute(interaction) {
		const target = interaction.options.getMember('target');
		const commander = interaction.member;
		const duration = getDuration(interaction.options.getInteger('duration'));
		const reason = interaction.options.getString('reason') || DEFAULT_MESSAGE;
		
		
		const channel = commander.voice.channel.id;
		// var voters = new Collection('discord-api-types').Snowflake, Member;
		//var voters = new Collection();
		//voters = channel.members;
		
		const message = await interaction.reply({ content:`Voting to Mute ${target} for ${duration} seconds due to ${reason}.`, fetchReply: true });
		message.react(NO_EMOJI);
		message.react(YES_EMOJI);

		if(compareMemberChannels(target, commander) && voteResult){
			// mute(target,duration);
		}
	}
}


function getDuration(duration){
	if(duration >= MIN_MUTE_LENGTH && duration <= MAX_MUTE_LENGTH){
		return duration;
	}
	else if(duration > MAX_MUTE_LENGTH){
		return MAX_MUTE_LENGTH;
	}
	else if(duration < MIN_MUTE_LENGTH){
		return MIN_MUTE_LENGTH;
	}
	return MIN_MUTE_LENGTH;
}

function voteResult(message,target){
	return true;
}

function compareMemberChannels(member1,member2){
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