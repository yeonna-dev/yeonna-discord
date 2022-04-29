import { Command } from 'comtroller';
import { Config } from 'yeonna-config';

import { getGuildChannelParameter } from '../actions/getGuildChannelParameter';

import { noRolePermissions } from '../guards/discordMemberPermissions';

import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

// TODO: Update responses.
export const rolerequestchannel: Command =
{
  name: 'rolerequestchannel',
  aliases: ['rrc'],
  guards: [noRolePermissions],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const guildChannelParameter = getGuildChannelParameter(discord, { excludeSameChannel: true });
    if(!guildChannelParameter)
      return;

    discord.startTyping();

    const { guildId, channelId, channelMention } = guildChannelParameter;
    try
    {
      await Config.updateGuild(guildId, { roleRequestsApprovalChannel: channelId });
      discord.send(`Set the role requests approval channel to ${channelMention}.`);
    }
    catch(error: any)
    {
      Log.error(error);
      discord.send('Could not set the channel for role requests.');
    }
  },
};
