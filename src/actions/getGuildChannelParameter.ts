import { DiscordMessage } from '../utilities/discord';

export function getGuildChannelParameter(message: DiscordMessage, {
  excludeSameChannel
}: {
  excludeSameChannel?: boolean,
} = {})
{
  /* Check if the command is used in a guild. */
  const guild = message.guild;
  const guildId = guild.id;
  if(!message.inGuild() || !guildId)
  {
    message.channel.send('This command can only be used in a guild.');
    return;
  }

  const channel = message.mentions.channels.first();
  if(!channel)
  {
    message.channel.send('Please include the channel where role requests will be sent.');
    return;
  }

  if(excludeSameChannel && channel.id === message.channel.id)
  {
    message.channel.send('Cannot be the same channel.');
    return;
  }

  /* Check if the mentioned channel is a text channel. */
  if(!channel.isText())
  {
    message.channel.send('The channel is not a text channel.');
    return;
  }

  /* Check if there is permission to send messages in the mentioned channel. */
  if(!message.canSendInChannel(channel))
  {
    message.channel.send('Cannot send messages in that channel.');
    return;
  }

  return {
    guildId,
    channel,
  };
}