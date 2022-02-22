import { Command } from 'comtroller';

import { updatePoints } from '../actions/updatePoints';

import { checkCooldownInGuild, cooldowns } from '../cooldowns';

import { DiscordMessage } from '../utilities/discord';

import { getTimeLeft } from '../helpers/getTimeLeft';

const command = 'daily';

/* Add 24-hour cooldown. */
cooldowns.add(command, 86400000, true);

// TODO: Update responses.
export const daily: Command =
{
  name: command,
  aliases: ['d'],
  run: async ({ message, params }: { message: DiscordMessage, params: string; }) =>
  {
    const { guild, author, channel } = message;
    if(!guild || !guild.id)
      return;

    const cooldown = await checkCooldownInGuild(command, guild.id, author.id);
    if(cooldown)
      return channel.send(`Please wait ${getTimeLeft(cooldown)}.`);

    const rng = Math.floor((Math.random() * 100) + 1);
    const [min, max] = (
      rng <= 5 ? [601, 700] :
        rng <= 20 ? [401, 600] : [200, 400]
    );

    const daily = Math.floor(Math.random() * (max - min)) + min;
    await updatePoints({ message, params, daily });
  },
};
