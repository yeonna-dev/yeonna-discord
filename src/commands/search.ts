import { Message } from 'discord.js';
import { Command } from 'comtroller';
import { obtainRandomItem } from 'yeonna-core';

import { cooldowns } from '../cooldowns/cooldowns-instance';
import { getTimeLeft } from '../helpers/getTimeLeft';

const name = 'search';

/* Add 25 second cooldown. */
cooldowns.add(name, 25000);

export const search: Command =
{
  name,
  aliases: [ 's' ],
  run: async ({ message }: { message: Message }) =>
  {
    const cooldown = await cooldowns.check(name, message.author.id);
    if(cooldown)
      return message.channel.send(`Please wait ${getTimeLeft(cooldown)}.`);

    if(! message.guild)
      return;

    message.channel.startTyping();

    const item = await obtainRandomItem({
      userIdentifier: message.author.id,
      discordGuildID: message.guild.id,
    });

    // TODO: Update message
    message.channel.send(item
      ? `Found **${item.name}**!`
      : 'Found trash.'
    );

    message.channel.stopTyping(true);
  },
};
