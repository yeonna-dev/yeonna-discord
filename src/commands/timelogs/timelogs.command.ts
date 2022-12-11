import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';

export const timelogs: Command =
{
  name: 'timelogs',
  aliases: ['tl'],
  run: async ({ discord }: { discord: Discord; }) =>
  {
    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();
    try
    {

    } catch(error)
    {

    }
  },
};
