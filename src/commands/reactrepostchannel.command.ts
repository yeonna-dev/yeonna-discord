import { Command } from 'comtroller';
import { getGuildChannelParameter } from 'src/actions/getGuildChannelParameter';
import { noManageChannelPermissions } from 'src/guards/discordMemberPermissions';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { ReactRepostCommandResponse } from 'src/responses/reactResponse';
import { Config } from 'yeonna-config';

export const reactrepostchannel: Command =
{
  name: 'reactrepostchannel',
  aliases: ['rpc'],
  guards: [noManageChannelPermissions],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const response = new ReactRepostCommandResponse(discord);

    const guildChannelParameter = getGuildChannelParameter(discord, { excludeSameChannel: true });
    if(!guildChannelParameter)
      return;

    discord.startTyping();

    const { guildId, channelId, channelMention } = guildChannelParameter;
    if(!channelMention)
      return;

    try
    {
      const { reactRepost } = await Config.ofGuild(guildId);
      await Config.updateGuild(guildId, { reactRepost: { ...reactRepost, channel: channelId } });
      response.channelChanged(channelMention);
    }
    catch(error: any)
    {
      Log.error(error);
      response.channelCannotSet();
    }
  },
};
