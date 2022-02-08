import { Command } from 'comtroller';
import { Config } from 'yeonna-config';

import { getGuildChannelParameter } from '../actions/getGuildChannelParameter';

import { noRolePermissions } from '../guards/discordMemberPermissions';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Update responses.
export const rolerequestchannel: Command =
{
  name: 'rolerequestchannel',
  aliases: ['rrc'],
  guards: [noRolePermissions],
  run: async ({ message }: { message: DiscordMessage, }) =>
  {
    const guildChannelParameter = getGuildChannelParameter(message, { excludeSameChannel: true });
    if(!guildChannelParameter)
      return;

    const { guildId, channel } = guildChannelParameter;
    try
    {
      await Config.updateGuild(guildId, { roleRequestsApprovalChannel: channel.id });
      message.channel.send(`Set the role requests approval channel to ${channel}.`);
    }
    catch(error: any)
    {
      Log.error(error);
      message.channel.send('Could not set the channel for role requests.');
    }
  },
};
