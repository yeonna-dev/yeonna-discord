import { Command } from 'comtroller';
import { Config } from 'yeonna-config';

import { getGuildChannelParameter } from '../actions/getGuildChannelParameter';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

export const reactrepostchannel: Command =
{
  name: 'reactrepostchannel',
  aliases: ['rpc'],
  run: async ({ message }: { message: DiscordMessage; }) =>
  {
    const guildChannelParameter = getGuildChannelParameter(message, { excludeSameChannel: true });
    if(!guildChannelParameter)
      return;

    const { guildId, channel } = guildChannelParameter;
    try
    {
      const { reactRepost } = await Config.ofGuild(guildId);
      await Config.updateGuild(guildId, { reactRepost: { ...reactRepost, channel: channel.id } });
      message.channel.send(`Set the react reposts approval channel to ${channel}.`);
    }
    catch(error: any)
    {
      Log.error(error);
      message.channel.send('Could not set the channel for react reposts.');
    }
  },
};
