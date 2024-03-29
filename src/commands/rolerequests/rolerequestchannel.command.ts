import { getGuildChannelParameter } from 'src/actions/getGuildChannelParameter';
import { noRolePermissions } from 'src/guards/discordMemberPermissions';
import { Log } from 'src/libs/logger';
import { RoleRequestsCommandResponse } from 'src/responses/roleRequests';
import { YeonnaCommand } from 'src/types';
import { Config } from 'yeonna-config';

export const rolerequestchannel: YeonnaCommand =
{
  name: 'rolerequestchannel',
  aliases: ['rrc'],
  guards: [noRolePermissions],
  run: async ({ discord }) =>
  {
    const response = new RoleRequestsCommandResponse(discord);

    const guildChannelParameter = getGuildChannelParameter(discord);
    if(!guildChannelParameter)
      return;

    discord.startTyping();

    const { guildId, channelId, channelMention } = guildChannelParameter;
    if(!channelMention)
      return;

    try
    {
      await Config.updateGuild(guildId, { roleRequestsApprovalChannel: channelId });
      response.channelChanged(channelMention);
    }
    catch(error: any)
    {
      Log.error(error);
      response.channelCannotSet();
    }
  },
};
