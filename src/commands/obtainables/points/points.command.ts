import { Command } from 'comtroller';
import { getUserParameter } from 'src/actions/getUserParameter';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { PointsCommandResponse } from 'src/responses/points';
import { Core } from 'yeonna-core';

export const points: Command =
{
  name: 'points',
  aliases: ['p'],
  run: async ({ discord, params }: { discord: Discord, params: string; }) =>
  {
    const response = new PointsCommandResponse(discord);

    if(!discord.getGuildId())
      return response.guildOnly();

    let userIdentifier;
    try
    {
      userIdentifier = await getUserParameter({ discord, params, defaultToAuthor: true });
    }
    catch(error)
    {
      Log.error(error);
    }

    if(!userIdentifier)
      return;

    discord.startTyping();

    try
    {
      const discordGuildId = discord.getGuildId();
      let points = await Core.Obtainables.getPoints({ userIdentifier, discordGuildId });
      points = points || 0;
      if(userIdentifier === discord.getAuthorId())
        response.show(points);
      else
        response.show(points, userIdentifier);
    }
    catch(error)
    {
      Log.error(error);
      response.show(0);
    }
  },
};
