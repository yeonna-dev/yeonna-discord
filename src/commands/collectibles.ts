import { Message } from 'discord.js';
import { Command } from 'comtroller';

import { getUserCollectibles } from 'yeonna-core';

export const collectibles: Command =
{
  name: 'collectibles',
  aliases: [ 'cs' ],
  run: async ({ message }: { message: Message }) =>
  {
    if(! message.guild)
      return message.channel.send('This command can only be used in a guild.');

    message.channel.startTyping();
    const collectibles = await getUserCollectibles({
      userIdentifier: message.author.id,
      discordGuildID: message.guild.id,
    });
    message.channel.send(`${message.member?.displayName} has ${collectibles} collectibles.`);
    message.channel.stopTyping(true);
  },
};
