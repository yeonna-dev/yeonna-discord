import { Command } from 'comtroller';
import { Core } from 'yeonna-core';
import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

export const collectibles: Command =
{
  name: 'collectibles',
  aliases: ['cs'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    discord.startTyping();
    try
    {
      const collectibles = await Core.Obtainables.getCollectibles({
        userIdentifier: discord.getAuthorId(),
        discordGuildId: discord.getGuildId(),
      });

      const memberDisplayName = await discord.getGuildMemberDisplayName();
      discord.send(`${memberDisplayName} has ${collectibles} collectibles.`);
    }
    catch(error)
    {
      Log.error(error);
      discord.send('0');
    }
  },
};
