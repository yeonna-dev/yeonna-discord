import { Command } from 'comtroller';
import { obtainRandomItem } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';

import { cooldowns } from '../cooldowns/cooldowns-instance';

import { getTimeLeft } from '../helpers/getTimeLeft';

const name = 'search';

/* Add 25 second cooldown. */
cooldowns.add(name, 25000);

export const search: Command =
{
  name,
  aliases: ['s'],
  run: async ({ message }: { message: DiscordMessage; }) =>
  {
    const cooldown = await cooldowns.check(name, message.author.id);
    if(cooldown)
      return message.channel.send(`Please wait ${getTimeLeft(cooldown)}.`);

    if(!message.guild)
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
  },
};
