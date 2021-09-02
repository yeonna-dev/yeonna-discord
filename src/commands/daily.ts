import { Message } from 'discord.js';
import { Command } from 'comtroller';

import { updatePoints } from '../actions/updatePoints';

import { cooldowns } from '../cooldowns/cooldowns-instance';
import { getTimeLeft } from '../helpers/getTimeLeft';

const command = 'daily';

/* Add 24-hour cooldown. */
cooldowns.add(command, 86400000, true);

// TODO: Update responses.
export const daily: Command =
{
  name: command,
  aliases: [ 'd' ],
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    const cooldown = await cooldowns.check(command, message.author.id);
    if(cooldown)
      return message.channel.send(`Please wait ${getTimeLeft(cooldown)}.`);

    const rng = Math.floor((Math.random() * 100) + 1);
    const [ min, max ] = (
      rng <= 5? [ 601, 700 ] :
      rng <= 20? [ 401, 600 ] : [ 200, 400 ]
    );

    const daily = Math.floor(Math.random() * (max - min)) + min;
    await updatePoints({ message, params, daily });
  },
};
