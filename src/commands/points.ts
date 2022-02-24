import { Command, parseParamsToArray } from 'comtroller';
import { Core } from 'yeonna-core';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Update responses
export const points: Command =
{
  name: 'points',
  aliases: ['p'],
  run: async ({ discord, params }: { discord: Discord, params: string; }) =>
  {
    if(!discord.getGuildId())
      return discord.send('This command can only be used in a guild.');

    let [userIdentifier] = parseParamsToArray(params);
    if(userIdentifier)
    {
      try
      {
        const memberId = await discord.getGuildMemberId(userIdentifier);
        if(memberId)
          userIdentifier = memberId;
      }
      catch(error)
      {
        Log.error(error);
      }
    }
    else
      userIdentifier = discord.getAuthorId();

    discord.startTyping();

    try
    {
      const discordGuildId = discord.getGuildId();
      const points = await Core.Users.getPoints({ userIdentifier, discordGuildId });
      discord.send(points?.toString() || '0');
    }
    catch(error)
    {
      Log.error(error);
      discord.send('0');
    }
  },
};
