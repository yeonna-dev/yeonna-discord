import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Core } from 'yeonna-core';

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
