import { Command } from 'comtroller';
import { getGuildChannelParameter } from 'src/actions/getGuildChannelParameter';
import { noManageChannelPermissions } from 'src/guards/discordMemberPermissions';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Config } from 'yeonna-config';

// TODO: Update responses.
export const reactrepostchannel: Command =
{
  name: 'reactrepostchannel',
  aliases: ['rpc'],
  guards: [noManageChannelPermissions],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const guildChannelParameter = getGuildChannelParameter(discord, { excludeSameChannel: true });
    if(!guildChannelParameter)
      return;

    discord.startTyping();

    const { guildId, channelId, channelMention } = guildChannelParameter;
    try
    {
      const { reactRepost } = await Config.ofGuild(guildId);
      await Config.updateGuild(guildId, { reactRepost: { ...reactRepost, channel: channelId } });
      discord.send(`Set the react reposts approval channel to ${channelMention}.`);
    }
    catch(error: any)
    {
      Log.error(error);
      discord.send('Could not set the channel for react reposts.');
    }
  },
};