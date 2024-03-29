const { SlashCommandBuilder, SlashCommandRoleOption } = require('@discordjs/builders');
const { Message, ThreadChannel, Collection, GuildMember } = require('discord.js');

const VOTING_TIME = 30;			//seconds
const MIN_MUTE_LENGTH = 30;
const MAX_MUTE_LENGTH = 180;
const DEFAULT_MESSAGE = 'their actions';
const NO_EMOJI = '🔊';
const YES_EMOJI = '🔇';
const ADMIN_ROLE_ID = "774365462984523806";

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
				.setDescription('Seconds Muted, Min:' + MIN_MUTE_LENGTH + ' Max:' + MAX_MUTE_LENGTH))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason For User Mute')),
		
	async execute(interaction) {
		const user = await interaction.member.fetch();
		const target = interaction.options.getMember('target');
		const duration = getDuration(interaction.options.getInteger('duration'));
		const reason = interaction.options.getString('reason') || DEFAULT_MESSAGE;

		if (!compareMemberChannels(user, target)) {
			await interaction.reply({ content: `You cannot Vote to Mute ${target} because they are in a different channel or offline.` });
		}
		else {
			let message = await interaction.reply({ content: `VOTING LIVE to Mute ${target} for ${duration} seconds due to ${reason}.`, fetchReply: true });
			await message.react(YES_EMOJI);
			await message.react(NO_EMOJI);
			

			const filter = async (reaction) => {
				return (reaction.emoji.name === YES_EMOJI || reaction.emoji.name === NO_EMOJI)
			}
			message.awaitReactions({ filter, time: VOTING_TIME * 1000 })
				.then(async collected => {
					message.edit(`VOTE CLOSED : TALLYING`);

					let totals = { [YES_EMOJI]: 0, [NO_EMOJI]: 0 };
					let channel = await interaction.client.channels.fetch(target.voice?.channel?.id)
					let users = channel.members;

					collected.reduce((acc, userReaction) => {
						acc[userReaction.emoji.name] = users.filter(x => userReaction.users.cache.find(u => u.id === x.id)).size;
						return acc;
					}, totals);

					if(totals[NO_EMOJI] >= totals[YES_EMOJI]){
						message.edit(`VOTE FAILED ${totals[YES_EMOJI]} TO ${totals[NO_EMOJI]}. ${target} not muted.`);
					}
					else if(totals[YES_EMOJI]  <= users.size /2){
						message.edit(`VOTE FAILED: Not enough votes cast `)
					}
					else {
						message.edit(`VOTE PASSED ${totals[YES_EMOJI]} TO ${totals[NO_EMOJI]}. Muting ${target} for ${duration} seconds due to ${reason}.`);		
						await muteAndDemote(target,duration);
					}	
				})
				//.catch(error => message.edit(`Oh shit something died ERROR:${JSON.stringify(error)}`));
		}
	}
}


function getDuration(duration) {
	if (duration >= MIN_MUTE_LENGTH && duration <= MAX_MUTE_LENGTH) {
		return duration;
	}
	else if (duration > MAX_MUTE_LENGTH) {
		return MAX_MUTE_LENGTH;
	}
	else if (duration < MIN_MUTE_LENGTH) {
		return MIN_MUTE_LENGTH;
	}
	return MIN_MUTE_LENGTH;
}

function compareMemberChannels(member1, member2) {
	return member1.voice?.channel?.id === member2.voice?.channel?.id;
}

async function muteAndDemote(member, timeout) {
	var flag = false;
	var currentMemberRoles = await member.roles.cache;

	if (currentMemberRoles.has(ADMIN_ROLE_ID)) {
		member.roles.remove(ADMIN_ROLE_ID);
		flag = true;			
	}
	member.voice.setMute(true);
	setTimeout(() => {
		member.voice.setMute(false);
		if(flag){
			member.roles.add(ADMIN_ROLE_ID);
			flag = false;
		}
	}, timeout * 1000);
}
