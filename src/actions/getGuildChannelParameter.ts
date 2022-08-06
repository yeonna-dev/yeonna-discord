import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export function getGuildChannelParameter(
  discord: Discord,
  { excludeSameChannel }: { excludeSameChannel?: boolean, } = {})
{
  const response = new CommandResponse(discord);

  /* Check if the command is used in a guild. */
  const guildId = discord.getGuildId();
  const mentionedChannelId = discord.getMentionedChannelId();

  if(!guildId)
    response.guildOnly();
  else if(!mentionedChannelId)
    response.noChannelMention();
  else if(excludeSameChannel && mentionedChannelId === discord.getChannelId())
    response.inSameChannel();
  /* Check if the mentioned channel is a text channel. */
  else if(!discord.mentionedChannelIsText())
    response.notTextChannel();
  /* Check if there is permission to send messages in the mentioned channel. */
  else if(!discord.canSendInChannel(mentionedChannelId))
    response.cannotSendMessages();
  else
    return {
      guildId,
      channelId: mentionedChannelId,
      channelMention: discord.getMentionedChannel(),
    };
}