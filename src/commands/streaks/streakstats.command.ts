import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { StreaksCommandResponse } from 'src/responses/streaks';
import { Core } from 'yeonna-core';

export const streakstats: Command =
{
  name: 'streakstats',
  aliases: ['sstats'],
  run: async ({ discord }: { discord: Discord; }) =>
  {
    const response = new StreaksCommandResponse(discord);

    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();

    discord.startTyping();
    try
    {
      const streak = await Core.Streaks.get({
        userIdentifier,
        discordGuildId,
      });

      if(!streak)
        return;

      response.stats(streak);
    }
    catch(error)
    {
      Log.error(error);
      return response.statsError();
    }
  },
};
