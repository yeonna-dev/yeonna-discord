import { Discord } from '../utilities/discord';

export function getGuildChannelParameter(
  discord: Discord,
  { excludeSameChannel }: { excludeSameChannel?: boolean, } = {})
{
  /* Check if the command is used in a guild. */
  const guildId = discord.getGuildId();
  if(!guildId)
  {
    discord.send('This command can only be used in a guild.');
    return;
  }

  const mentionedChannelId = discord.getMentionedChannelId();
  if(!mentionedChannelId)
  {
    discord.send('Please mention the channel where role requests will be sent.');
    return;
  }

  if(excludeSameChannel && mentionedChannelId === discord.getChannelId())
  {
    discord.send('Cannot be the same channel.');
    return;
  }

  /* Check if the mentioned channel is a text channel. */
  if(!discord.mentionedChannelIsText())
  {
    discord.send('The channel is not a text channel.');
    return;
  }

  /* Check if there is permission to send messages in the mentioned channel. */
  if(!discord.canSendInChannel(mentionedChannelId))
  {
    discord.send('Cannot send messages in that channel.');
    return;
  }

  return {
    guildId,
    channelId: mentionedChannelId,
    channelMention: discord.getMentionedChannel(),
  };
}