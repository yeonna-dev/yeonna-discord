import { Command } from 'comtroller';
import { Core } from 'yeonna-core';
import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

export const streakstats: Command =
{
  name: 'streakstats',
  aliases: ['sstats'],
  run: async ({ discord }: { discord: Discord; }) =>
  {
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

      const { count, longest, updatedAt, createdAt } = streak;
      const countString = `${count} day${count === 1 ? '' : 's'}`;
      const longestString = `${longest} day${longest === 1 ? '' : 's'}`;

      const lastUpdateDate = new Date(updatedAt);
      const lastUpdateSeconds = Math.floor(lastUpdateDate.getTime() / 1000);

      const startedSinceDate = new Date(createdAt);
      const startedSinceSeconds = Math.floor(startedSinceDate.getTime() / 1000);

      const embed = discord.createDiscordEmbed({
        description: (
          'Current streak'
          + `\n **${countString}**`
          + '\n\nLast update'
          + `\n**<t:${lastUpdateSeconds}:F>**`
          + '\n\nLongest streak'
          + `\n**${longestString}**`
          + '\n\nStarted since'
          + `\n**<t:${startedSinceSeconds}:F>**`
        ),
      });

      discord.replyEmbed(embed);
    }
    catch(error)
    {
      Log.error(error);
      return discord.send('Oops. Something went wrong. Please try again.');
    }
  },
};
