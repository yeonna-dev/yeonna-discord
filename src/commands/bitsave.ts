import { Command } from 'comtroller';
import { saveUserBit } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

export const bitsave: Command =
{
  name: 'bitsave',
  aliases: ['bs'],
  run: async ({ message, params }: { message: DiscordMessage, params: string; }) =>
  {
    if(!params)
      return message.channel.send('Please add content to the bit.');

    try
    {
      message.channel.startTyping();

      const userBit = await saveUserBit({
        userIdentifier: message.author.id,
        content: params,
        discordGuildID: 'true',
      });

      if(!userBit)
        return message.channel.send('You already saved that bit.');

      message.channel.send('Saved bit.');
    }
    catch(error: any)
    {
      Log.error(error);
      message.channel.send('Could not save bit.');
    }
  },
};
