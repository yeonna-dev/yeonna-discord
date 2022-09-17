import { Log } from 'src/libs/logger';
import { StreaksCommandResponse } from 'src/responses/streaks';
import { YeonnaCommand } from 'src/types';
import { Config } from 'yeonna-config';

export const streakhelp: YeonnaCommand =
{
  name: 'streakhelp',
  aliases: ['shelp'],
  run: async ({ discord }) =>
  {
    const response = new StreaksCommandResponse(discord);

    const guildId = discord.getGuildId();
    if(!guildId)
      return;

    let prefix;
    try
    {
      const guildConfig = await Config.ofGuild(guildId);
      if(guildConfig)
        prefix = guildConfig.prefix;

      if(!prefix)
      {
        const globalConfig = await Config.global();
        prefix = globalConfig.prefix;
      }
    }
    catch(error)
    {
      Log.error(error);
    }

    response.help(prefix || ';');
  },
};
