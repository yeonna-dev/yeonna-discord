import { DiscordMessage } from '../utilities/discord';

// TODO: Update responses.
export async function getGuildMember(
	message: DiscordMessage,
	idOrMention: string,
	errorMessage?: string,
)
{
	if(idOrMention.startsWith('<@') && idOrMention.endsWith('>'))
	{
		idOrMention = idOrMention.slice(2, -1);

		if(idOrMention.startsWith('!'))
			idOrMention = idOrMention.slice(1);

		if(idOrMention.startsWith('&'))
			idOrMention = idOrMention.slice(1);
	}

	const member = await message.guild.getMember(idOrMention);
	if(!member)
		message.channel.send(errorMessage || 'User is not a member of this server.');
	else
		return member;
}