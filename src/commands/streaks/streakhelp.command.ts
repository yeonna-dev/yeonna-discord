import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { StreakCommandResponse } from 'src/responses/streaks';
import { Config } from 'yeonna-config';

export const streakhelp: Command =
{
  name: 'streakhelp',
  aliases: ['shelp'],
  run: async ({ discord }: { discord: Discord; }) =>
  {
    const response = new StreakCommandResponse(discord);

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
