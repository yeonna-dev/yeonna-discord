import { Command } from 'comtroller';
import { getGuildChannelParameter } from 'src/actions/getGuildChannelParameter';
import { noRolePermissions } from 'src/guards/discordMemberPermissions';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { RoleRequestsCommandResponse } from 'src/responses/roleRequests';
import { Config } from 'yeonna-config';

export const rolerequestchannel: Command =
{
  name: 'rolerequestchannel',
  aliases: ['rrc'],
  guards: [noRolePermissions],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const response = new RoleRequestsCommandResponse(discord);

    const guildChannelParameter = getGuildChannelParameter(discord, { excludeSameChannel: true });
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
