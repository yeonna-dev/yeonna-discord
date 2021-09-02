import { Message } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';
import { saveUserBit } from 'yeonna-core';

import { Log } from '../utilities/logger';

export const bitsave: Command =
{
  name: 'bitsave',
  aliases: [ 'bs' ],
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    if(! params)
      return message.channel.send('Please add content to the bit.');

    try
    {
      message.channel.startTyping();

      const userBit = await saveUserBit({
        userIdentifier: message.author.id,
        content: params,
        discordGuildID: 'true',
      });

      if(! userBit)
        return message.channel.send('You already saved that bit.');

      message.channel.send('Saved bit.');
    }
    catch(error)
    {
      Log.error(error);
      message.channel.send('Could not save bit.');
    }
    finally
    {
      message.channel.stopTyping(true);
    }
  },
};
