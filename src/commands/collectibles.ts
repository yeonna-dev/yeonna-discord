import { Command } from 'comtroller';
import { Core } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';

export const collectibles: Command =
{
  name: 'collectibles',
  aliases: ['cs'],
  run: async ({ message }: { message: DiscordMessage; }) =>
  {
    if(!message.guild)
      return message.channel.send('This command can only be used in a guild.');

    message.channel.startTyping();
    const collectibles = await Core.Users.getUserCollectibles({
      userIdentifier: message.author.id,
      discordGuildId: message.guild.id,
    });
    message.channel.send(`${message.member?.displayName} has ${collectibles} collectibles.`);
  },
};
