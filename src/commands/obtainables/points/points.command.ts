import { Command } from 'comtroller';
import { getUserParameter } from 'src/actions/getUserParameter';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Core } from 'yeonna-core';

export const points: Command =
{
  name: 'points',
  aliases: ['p'],
  run: async ({ discord, params }: { discord: Discord, params: string; }) =>
  {
    if(!discord.getGuildId())
      return discord.send('This command can only be used in a guild.');

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
      const points = await Core.Obtainables.getPoints({ userIdentifier, discordGuildId });
      discord.send(points?.toString() || '0');
    }
    catch(error)
    {
      Log.error(error);
      discord.send('0');
    }
  },
};
