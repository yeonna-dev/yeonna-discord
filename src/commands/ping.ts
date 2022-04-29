import { Command } from 'comtroller';

import { Discord } from '../libs/discord';

export const ping: Command =
{
  name: 'ping',
  run: ({ discord }: { discord: Discord, }) =>
  {
    const embed = discord.createDiscordEmbed({ title: `${~~(discord.getPing())} ms` });
    discord.sendEmbed(embed);
  },
};
