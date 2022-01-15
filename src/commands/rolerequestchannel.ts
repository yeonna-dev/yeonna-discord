import { Command } from 'comtroller';

import { getGuildChannelParameter } from '../actions/getGuildChannelParameter';

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
    const guildChannelParameter = getGuildChannelParameter(message, { excludeSameChannel: true });
    if(!guildChannelParameter)
      return;

    const { guildId, channel } = guildChannelParameter;
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
