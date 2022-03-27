import { Command } from 'comtroller';
import { Config } from 'yeonna-config';
import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

export const streakhelp: Command =
{
  name: 'streakhelp',
  aliases: ['shelp'],
  run: async ({ discord }: { discord: Discord; }) =>
  {
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
        prefix = globalConfig.prefix || ';';
      }

    }
    catch(error)
    {
      Log.error(error);
    }

    const embed = discord.createDiscordEmbed({
      title: 'Commands',
      fields: [
        {
          name: `\`${prefix}up\``,
          value: 'Increase your streak by 1',
        },
        {
          name: `\`${prefix}down\``,
          value: 'Decrease your streak by 1',
        },
        {
          name: `\`${prefix}set (number)\``,
          value: 'Set your streak to the specified number',
        },
        {
          name: `\`${prefix}reset\``,
          value: 'Reset your streak to 0',
        },
        {
          name: `\`${prefix}stats\``,
          value: 'Show your streak statistics',
        },
        {
          name: `\`${prefix}help\``,
          value: 'Show this message',
        },
      ],
    });

    discord.replyEmbed(embed);
  },
};
