import { Command } from 'comtroller';
import { Config } from '../utilities/config';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Update responses.
export const rolerequestchannel: Command =
{
  name: 'rolerequestchannel',
  aliases: ['rrc'],
  run: async ({ message }: { message: DiscordMessage, }) =>
  {
    /* Check if the command is used in a guild. */
    const guildId = message.guild.id;
    if(!message.inGuild() || !guildId)
      return message.channel.send('This command can only be used in a guild.');

    const channel = message.mentions.channels.first();
    if(!channel)
      return message.channel.send('Please include the channel where role requests will be sent.');

    /* Check if the mentioned channel is a text channel. */
    if(!channel.isText())
      return message.channel.send('The channel is not a text channel.');

    /* Check if there is permission to send messages in the mentioned channel. */
    if(!message.canSendInChannel(channel))
      return message.channel.send('Cannot send messages in that channel.');

    try
    {
      await Config.setRoleRequestsApprovalChannel(guildId, channel.id);
      message.channel.send(`Set the role requests approval channel to ${channel}.`);
    }
    catch(error: any)
    {
      Log.error(error);
      message.channel.send('Could not set the channel for role requests.');
    }
  },
};
